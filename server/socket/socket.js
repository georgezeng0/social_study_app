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
        socket.on('USER_CONNECTED', (data) => {
            // Join user room (so can broadcast to user's open tabs/devices)
            socket.join(data.userMongoID)
            // Potentially change user status to "online" - TBD feature
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
                if (sockets.indexOf(socketID) < 0) {
                    room.users[ind].socketID.push(socketID)
                    await room.save()
                    // Join socket to chat room
                    socket.join(c_id)
                }
            }
            
        });

        // Listen for message
        // socket.on('message', (data) => {
        //     console.log(data);
        //     socketIO.emit('messageResponse', data)
        // })

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`🔥: ${socket.id} user disconnected`);
            //Sends the list of updated users to the client
            // socketIO.emit('newUserResponse', users);
            socket.disconnect();
        });
    });

    return socketIO
}