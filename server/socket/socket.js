const User = require('../../models/userSchema')
const Chat = require('../../models/chatSchema')
const mongoose = require('mongoose')

module.exports = (server) => {
    const socketIO = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000"
        }
    });

    socketIO.on('connection', (socket) => {
        //socket.id - id created when connection is made
        console.log(`⚡: ${socket.id} user just connected!`);

        // Listens when new user joins server
        socket.on('USER_CONNECTED', async (data) => {
            // Join user room (so can broadcast to user's open tabs/devices)
            const { userMongoID } = data
            socket.join(userMongoID)
            // Potentially change user status to "online" - TBD feature
            //
            //

            // Check if user is in a room and if so, sync this socket to it
            const rooms = await Chat.find({ users: { $elemMatch: { user: mongoose.Types.ObjectId(userMongoID) } } }) //not populated user object

            let c_id 
            if (rooms.length) {
                c_id = rooms[0]._id.toString()
                socket.join(c_id)
            
                const socketRooms = socketIO.of("/").adapter.rooms // Map object - for read purposes, do not alter
                const socketUserRoom = Array.from(socketRooms.get(userMongoID)) // Set object of socket IDs with user logged in (different tabs/devices)
                // Need to convert to array for mongoose schema

                // Update socketIDs of user in chatroom
                await Chat.updateMany(
                    { users: { $elemMatch: { user: mongoose.Types.ObjectId(userMongoID) } } },
                    { $set: { "users.$[el].socketID": socketUserRoom } },
                    { arrayFilters: [{ "el._id": userMongoID }] })
                
                socketIO.emit('UPDATE_CLIENT_SINGLE_USER_SOCKETS', {
                    c_id: c_id,
                    userMongoID,
                    socketID: socketUserRoom
                    })
            }
            
        });

        // Listens for when user joins a chatroom
        socket.on('USER_JOIN_ROOM', async (data) => {
            const { userMongoID, c_id, socketID } = data
            // Update database with socket info
            const room = await Chat.findById(c_id)
            // Search for user in chatroom (should be present if event has been emitted)
            const ind = room.users.findIndex(item => { 
                return item.user.toString() === userMongoID})

            if (ind > -1) {
                const sockets = room.users[ind].socketID
                // Add socket ID to be associated with user in the chatRoom
                // Redux state is adjusted in a similar way in redux socket middleware
                if (sockets.indexOf(socketID) < 0) {
                    room.users[ind].socketID.push(socketID)
                    await room.save()
                    // Join socket to chat room
                    socket.join(c_id.toString())
                }
            }
            
        });

        // Listen for message
        // socket.on('message', (data) => {
        //     console.log(data);
        //     socketIO.emit('messageResponse', data)
        // })

        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`🔥: ${socket.id} user disconnected`);
            const rooms = await Chat.updateMany(
                // Find all rooms that have matching socketID (even though should only be in one room at a time)
                { users: { $elemMatch: { socketID: { $in: [socket.id] } } } },
                { $pull: {users: {socketID: socket.id} } }
            )
            // Sends the list of updated users to the client
            // socketIO.emit('newUserResponse', users);
            socket.disconnect();
        });
    });

    return socketIO
}