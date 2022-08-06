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
app.get("/api/flashcards", async(req, res, next)=> {
    try {
        const flashcards = await Flashcard.find(); 
        res.send(flashcards)
    } catch (error) {
        next(error)
    }
})

app.post("/api/flashcards/new", async (req, res, next) => {
    try {
        const flashcard = new Flashcard(req.body); 
        await flashcard.save()
        res.send({message: "flashcard created"})
    } catch (error) {
        next(error)
    }
})

app.patch("/api/flashcards/:f_id", async (req, res, next) => {
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(
            req.params.f_id,
            req.body,
            { runValidators: true }
        )
        await updatedFlashcard.save()
        res.send({
            old: updatedFlashcard,
            message: "flashcard updated"
        })
    } catch (error) {
        next(error)
    }
})

app.delete("/api/flashcards/:f_id", async (req, res, next) => {
    try {
        const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.f_id)
        res.send({old: deletedFlashcard, message: "flashcard deleted"})
    } catch (error) {
        next(error)
    }
})



/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})