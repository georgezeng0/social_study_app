const mongoose = require('mongoose');
const Flashcard = require('./flashcardSchema');

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

setSchema.post('findOneAndDelete', async (set) => {
    // Deleting set will also delete child flashcards
    if (set.flashcards.length) {
        await Flashcard.deleteMany({ _id: { $in: set.flashcards } })
    }
})

const Set = mongoose.model('Set', setSchema);

module.exports=Set