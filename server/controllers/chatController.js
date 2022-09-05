// const mongoose = require('mongoose');
const Chat = require('../../models/chatSchema');
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');

module.exports.createRoom = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    const user = await User.findById(req.body.owner)
    if (auth_id === user.u_id) {
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

// Deleting room - remember to use find one and delete method for casade