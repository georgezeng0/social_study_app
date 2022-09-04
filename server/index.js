// index.js

/**
 * Required modules
 */

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const wrapAsync = require('./utils/wrapAsync')
const AppError = require('./utils/appError')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const cors = require('cors');

// Mongoose models

// Routes import
const flashcardRoutes = require('./routes/flashcardRoutes')
const setRoutes = require('./routes/setRoutes')
const userRoutes = require('./routes/userRoutes')

/**
 * App variables
 */
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/socialStudy"
const SESSION_SECRET = process.env.SESSION_SECRET
const PORT = process.env.PORT || 5000;

/**
 * Mongoose connection
 */

 mongoose.connect(MONGODB_URL)
 .then( ()=>{
     console.log("MongoDB connected")
 })
 .catch( err => {
     console.log(`MonogDB Connection error - ${err}`)
 })

// MongoDB session store

const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
})
store.on('error', function(error) {
    console.log(error);
  });

/**
 * App Configuration
 */

const app = express()

// Use cors for data transfer between client and server for chat app
app.use(cors());

// JSON body parser & url encoded bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: SESSION_SECRET,
    name: 'studyApp.sid', // Otherwise default is "connect.sid"
    cookie: {
        path: '/', // Default
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: false, // Consider true for production which requires https website.
    },
    store: store, // Set to the mongoDB store set up above
    resave: false,
    saveUninitialized: true,
}))

// Socket.io
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
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
        if (users.findIndex(item=>item.u_id==data.u_id)==-1){users.push(data)}
        
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

/**
 * Routes Definitions
 */

app.get("/api", (req, res) => {
    res.send({message: "Server Responding!!"})
})

// Flashcard routes
app.use("/api/flashcards", flashcardRoutes)

// Set routes
app.use("/api/sets", setRoutes)

// User routes
app.use("/api/users", userRoutes)

// Sends session for development purposes.
if (process.env.NODE_ENV !== "production") {
    app.get("/testSession", (req, res) => {
        res.send(req.session)
    })
}

/**
 *  Error Handling
 */

// Find error names when testing > for handling specific error names
app.use((err, req, res, next) => {
    console.log(err); //Find error name
    // if (err.name==="ValidationError") {
    //     err=handleValidationErr(err); // Eaxmple: if validation error > handle it via another middleware (e.g. setting specific status/message)
    // }
    next(err)
})

// Final error handler
// Deconstructs the status, message, name and stack from error object. If not in production, will send stack.
app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Error', name = 'Error', stack } = err;
    if (process.env.NODE_ENV !== "production") {
        res.status(status).send({ errorName:name, message, stack })
    } else {
        res.status(status).send({ errorName:name, message });
    }
})

/**
 * Server Activation
 */

http.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

