// const mongoose = require('mongoose');
const Chat = require('../../models/chatSchema');
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');
const mongoose = require('mongoose')
const AppError = require('../utils/appError')

module.exports.createRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const user = await User.findById(req.body.owner)
    if (auth_id === user?.u_id) {
        const room = new Chat({ ...req.body })
        await room.save()
        res.send(room)
    } else {
        res.status(401).send({ message: "Unauthorised"})
    } 
}

module.exports.getRooms = async (req, res, next) => {
    const rooms = await Chat.find()
    res.send(rooms)
}
// Update room (settings)
//   TBD
//
// Deleting room - remember to use find one and delete method for casade
//   TBD
//   

module.exports.joinRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const mongoUserID = req.body.user
    const user = await User.findById(mongoUserID)
    if (auth_id === user?.u_id) {
        const room = await Chat.findById(req.params.c_id).populate({path:'users',populate:'user'})
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
        res.status(401).send({ message: "Unauthorised"})
    } 
}

module.exports.getOneChatRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const c_id = req.params.c_id
    //
    // TBD - private room - only return room if user is member
    //
    const room = await Chat.findById(c_id).populate({ path: 'users', populate: 'user' }).populate('messages')
    if (!room) {
        return next(new AppError(404,"Chatroom Not Found"))
    }
    res.send(room)
}

module.exports.leaveRoom = async (req, res, next) => {
    const { payload: { sub: auth_id, permissions } } = req.auth
    const mongoUserID = req.body.user
    const user = await User.findById(mongoUserID)
    const c_id = req.params.c_id
    if (auth_id === user?.u_id) {
        // pull user
        const room = await Chat.findByIdAndUpdate(c_id, { $pull: { users: { user: mongoUserID } }}, {new: true})
        res.send(room)
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
        const message = new Message({
            body: body,
            author: user,
            authorName: user._id, // Need to change this later when names added to DB
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
}