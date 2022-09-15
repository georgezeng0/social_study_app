// const mongoose = require('mongoose');
const Chat = require('../../models/chatSchema');
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');
const mongoose = require('mongoose')
const AppError = require('../utils/appError')

// Random hex generator, pass in size of string to function. Returns randomly generated hex string.
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

module.exports.createRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const user = await User.findById(req.body.owner)
    if (auth_id === user?.u_id) {
        const room = new Chat({
            ...req.body,
            passcode: genRanHex(6),
        })
        await room.save()
        res.send(room)
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

// Get all rooms
module.exports.getRooms = async (req, res, next) => {
    const rooms = await Chat.find()
    res.send(rooms)
}

// Get user rooms
module.exports.getUserRooms = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const { u_id } = req.params
    const [user] = await User.find({ u_id: u_id })
    if (auth_id === u_id) {
        const joinedRooms = await Chat.find({ "users.user": user })
            .populate({ path: 'users', populate: 'user' })
            .populate('messages')
            .populate({ path: 'messages', populate: 'author' })
        res.send(joinedRooms)
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

// Update room (settings)
module.exports.editChatRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const room = await Chat.findById(req.params.c_id).populate('owner')
        .populate({ path: 'users', populate: 'user' }).populate('messages').populate({ path: 'messages', populate: 'author' })
    if (auth_id === room.owner.u_id) {
        Object.keys(req.body).map(key => {
            room[key]=req.body[key]
        })
        await room.save()
        if (room.isPublic) {
            res.send(room)
        } else {
            res.send({
                _id: room._id,
                title: room.title,
                isPublic: room.isPublic,
                owner: room.owner
            })
        }
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

// Deleting room - remember to use find one and delete method for casade
module.exports.deleteChatRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const room = await Chat.findById(req.params.c_id).populate('owner')
    if (auth_id === room.owner.u_id) {
        const deletedRoom = await Chat.findOneAndDelete({ _id: req.params.c_id })
        res.send(deletedRoom)
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

module.exports.joinRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const mongoUserID = req.body.user
    const passcode = req.body.passcode
    const user = await User.findById(mongoUserID)
    if (auth_id === user?.u_id) {
        const room = await Chat.findById(req.params.c_id)
            .select("+passcode").populate({ path: 'users', populate: 'user' })
            .populate('messages').populate({ path: 'messages', populate: 'author' })
        // Check if passcode is correct or if use is owner
        if (passcode === room.passcode || room.owner.toString() === mongoUserID) {
            // If user not in room, push. Socket ID will be added by socket handler.
            if (room.users.findIndex(item => item.user._id.toString() === user._id.toString()) < 0) {
                room.users.push({
                    user: user,
                    socketIDList: []
                })
            }
            await room.save()
            res.send(room)
        } else {
            // If passcode is not correct
            res.status(401).send({ message: "Passcode missing or incorrect"})
        }
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

module.exports.getOneChatRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const c_id = req.params.c_id

    const room = await Chat.findById(c_id)
        .select("+passcode").populate({ path: 'users', populate: 'user' })
        .populate('messages').populate({ path: 'messages', populate: 'author' })
    if (!room) {
        return next(new AppError(404,"Chatroom Not Found"))
    }
    if (room.users.findIndex(user => user.user.u_id === auth_id) > -1) {
        // If member, send room along with passcode
        res.send(room)
    } else {
        // If not a member - dont send message and users info
        res.send({
            _id: room._id,
            title: room.title,
            isPublic: room.isPublic,
            owner: room.owner
        })
    }
    
}

module.exports.leaveRoom = async (req, res, next) => {
    const { payload: { sub: auth_id, permissions } } = req.auth
    const mongoUserID = req.body.user
    const user = await User.findById(mongoUserID)
    const c_id = req.params.c_id
    if (auth_id === user?.u_id) {
        // pull user
        const room = await Chat.findByIdAndUpdate(c_id, { $pull: { users: { user: mongoUserID } } }, { new: true }).populate({ path: 'users', populate: 'user' })
            .populate('messages').populate({ path: 'messages', populate: 'author' })
        if (room.isPublic) {
            res.send(room)
        } else {
            res.send({
                _id: room._id,
                title: room.title,
                isPublic: room.isPublic,
                owner: room.owner
            })
        }
    } else {
        res.status(401).send({ message: "Unauthorised"})
    }
}

// message Schema for reference
// {
//     body: {type: String, required: true},
//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
//     authorName: { type: String, required: true },
//     date: { type: Date, required: true },
//     chatroom: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" , required: true}
// }

module.exports.createMessage = async (req, res, next) => {
    const { payload: { sub: auth_id, permissions } } = req.auth
    const { mongoUserID, body } = req.body
    const { c_id } = req.params
    const user = await User.findById(mongoUserID)
    if (auth_id === user?.u_id) {
        const room = await Chat.findById(c_id)
        if (!room) {
            return next(new AppError(404,'Chatroom not found.'))
        }
        if (room.users.findIndex(user => user.user.u_id === auth_id) > -1) {
            const message = new Message({
                body: body,
                author: user,
                date: Date.now(),
                chatRoom: mongoose.Types.ObjectId(c_id)
            })
            await message.save()
            room.messages.push(message)
            await room.save()
            res.send(message)
        } else {
            res.status(401).send({ message: "Unauthorised"})
        }
            
    } else {
        res.status(401).send({ message: "Unauthorised"})
    }
}