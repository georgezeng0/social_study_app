const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }],
        // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        public: Boolean
    });

const Set = mongoose.model('Set', setSchema);

module.exports=Set