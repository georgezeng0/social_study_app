const mongoose = require('mongoose');
const Flashcard = require('./flashcardSchema');

const cloudinary = require('cloudinary').v2;

const setSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }],
        tags: [String],
        stats: {
            numFlashcards: { type: Number, default: 0 }
        },
        // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        isPublic: Boolean
    });

// Deleting set will also delete child flashcards
setSchema.pre('findOneAndDelete', function () {
    // Cannot use arrow function so that "this" points to the query instance
    // Populate the set so that the image url can be found in the post middleware
    this.populate('flashcards')
})

setSchema.post('findOneAndDelete', async (set) => {
    const flashcards=set.flashcards
    if (flashcards.length > 0) {
        flashcards.map((card) => {
            if (card?.image?.publicID) {
                cloudinary.uploader.destroy(card.image.publicID, function(error,result) {
                    console.log("Delete Cloudinary image post-flashcard deletion :",result, error) });
            }
        })
        await Flashcard.deleteMany({ _id: { $in: set.flashcards } })
    }
})

const Set = mongoose.model('Set', setSchema);

module.exports=Set