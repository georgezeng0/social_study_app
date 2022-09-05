module.exports = (server) => {
    const socketIO = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000"
        }
    });
    let users = []
    socketIO.on('connection', (socket) => {
        //socket.id - id created when connection is made
        console.log(`⚡: ${socket.id} user just connected!`);

        // Listens when new user joins server
        socket.on('newUser', (data) => {
            //Adds the new user to the list of users
            if (users.findIndex(item => item.u_id == data.u_id) == -1) { users.push(data) }
        
            //Sends the list of users to the client
            socketIO.emit('newUserResponse', users);
        });

        // Listen for message
        socket.on('message', (data) => {
            console.log(data);
            socketIO.emit('messageResponse', data)
        })

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`🔥: ${socket.id} user disconnected`);
            users = users.filter((user) => user.socketID !== socket.id);
            //Sends the list of users to the client
            socketIO.emit('newUserResponse', users);
            socket.disconnect();
        });
    });

    return socketIO
}