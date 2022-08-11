const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
    {
        title: { type: String, default: 'Untitled Flashcard' },
        front: String,
        back: String,
        notes: String,
        parentSet: { type: mongoose.Schema.Types.ObjectId, ref: "Set" },
        reversible: { type: Boolean, default: false}, // Can the card be reversed
        stats: {
            difficulty: Number, // 0-3 : Easy, Medium, Hard, Very Hard
            // attempts tracking, + more stats?
        },
        image: String
    });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports=Flashcard