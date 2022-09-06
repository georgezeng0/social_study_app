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
            //Adds the new user to the list of users
            console.log(data);
        
            //Sends the list of users to the client
            // socketIO.emit('newUserResponse', users);
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