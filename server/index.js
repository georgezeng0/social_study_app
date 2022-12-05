/**
 * Required modules
 */

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet')
const path = require('path')


// Routes import
const flashcardRoutes = require('./routes/flashcardRoutes')
const setRoutes = require('./routes/setRoutes')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')


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

/**
 * App Configuration
 */

const app = express()

// Use cors for data transfer between client and server for chat app
app.use(cors());

// JSON body parser & url encoded bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Socket.io
const http = require('http').Server(app);
// Run socket config code and event controller
require('./socket/socket.js')(http)

// Helmet
// if (process.env.NODE_ENV !== "production") {
//     app.use(helmet({
//         contentSecurityPolicy: {
//             directives: {
//                 "default-src": ["'self'","fonts.gstatic.com","blob:","*.cloudinary.com","*.auth0.com","*.youtube.com"],
//                     "font-src": ["'self'", "https:", "data:", "fonts.gstatic.com"],
//                     "script-src": ["'self'","blob:","*.youtube.com","https://www.youtube.com/iframe_api"],
//                     "img-src": ["'self'", "images.unsplash.com", "data:", "*.cloudinary.com", "blob:"]
//             }
//         },
//         crossOriginEmbedderPolicy: false,
//         expectCt: false,
//     }))
// } else {
//     app.use(
//         helmet({
//             contentSecurityPolicy: {
//                 directives: {
//                     "default-src": ["'self'" ,"fonts.gstatic.com","blob:","*.cloudinary.com","*.auth0.com","*.youtube.com"],
//                     "font-src": ["'self'", "https:", "data:", "fonts.gstatic.com"],
//                     "script-src": ["'self'","blob:","*.youtube.com","https://www.youtube.com/iframe_api"],
//                     "img-src": ["'self'", "images.unsplash.com", "data:", "*.cloudinary.com", "blob:"]
//                 }
//             },
//             crossOriginResourcePolicy: true,
//             crossOriginEmbedderPolicy: false,
//         })
//     );
// }

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

// Chat routes
app.use("/api/chat", chatRoutes)

// Route to react html for other routes
app.use(express.static(path.join(__dirname, "../app/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../app/build/index.html"))
})

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

