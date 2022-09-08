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
    const room = await Chat.findById(c_id).populate({ path: 'users', populate: 'user' })
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

