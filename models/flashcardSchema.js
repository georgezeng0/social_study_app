const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
    {
        front: String,
        back: String,
        set: { type: mongoose.Schema.Types.ObjectId, ref: "Set" }
    });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports=Flashcard