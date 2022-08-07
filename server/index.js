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

// Mongoose models
const Flashcard = require('../models/flashcardSchema');

/**
 * App variables
 */

const PORT = process.env.PORT || 5000;

/**
 * Mongoose connection
 */

 mongoose.connect("mongodb://localhost:27017/socialStudy")
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

// JSON body parser & url encoded bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/**
 * Routes Definitions
 */

app.get("/api", (req, res) => {
    res.send({message: "Server Responding!!"})
})

// Flashcard routes
app.get("/api/flashcards", wrapAsync(async(req, res, next)=> {
    const flashcards = await Flashcard.find(); 
    res.send(flashcards)
}))

app.post("/api/flashcards/new", wrapAsync(async (req, res, next) => {
    const flashcard = new Flashcard(req.body); 
    await flashcard.save()
    res.send({message: "Flashcard created"})
}))

app.patch("/api/flashcards/:f_id", wrapAsync(async (req, res, next) => {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
        req.params.f_id,
        req.body,
        { runValidators: true }
    )
    await updatedFlashcard.save()
    res.send({
        oldFlashcard: updatedFlashcard,
        message: "Flashcard updated"
    })
}))

app.delete("/api/flashcards/:f_id", wrapAsync(async (req, res, next) => {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.f_id)
    res.send({
        deletedFlashcard: deletedFlashcard,
        message: "Flashcard deleted"
    })
}))

/**
 *  Error Handling
 */

// Find error names when testing > for handling specific error names
app.use((err, req, res, next) => {
    console.log(err.name); //Find error name
    // if (err.name==="ValidationError") {
    //     err=handleValidationErr(err); // Eaxmple: if validation error > handle it via another middleware (e.g. setting specific status/message)
    // }

    next(err)
})


app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Error' } = err;
    res.status(status).send(message);
})

/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})