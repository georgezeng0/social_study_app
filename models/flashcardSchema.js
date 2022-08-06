const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
    {
        front: String,
        back: String
    });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports=Flashcard