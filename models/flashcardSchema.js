const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
    {
        title: { type: String, default: 'Untitled Flashcard' },
        front: String,
        back: String,
        parentSet: { type: mongoose.Schema.Types.ObjectId, ref: "Set" }
    });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports=Flashcard