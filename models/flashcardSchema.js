const mongoose = require('mongoose');

// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config();
// }

const cloudinary = require('cloudinary').v2;

const flashcardSchema = new mongoose.Schema(
    {
        title: { type: String, default: 'Untitled Flashcard' },
        front: String,
        back: String,
        notes: String,
        parentSet: { type: mongoose.Schema.Types.ObjectId, ref: "Set" },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reversible: { type: Boolean, default: false}, // Can the card be reversed
        stats: {
            difficulty: Number, // 0-3 : Easy, Medium, Hard, Very Hard
            // attempts tracking, + more stats?
        },
        image: {
            url: String,
            thumb: String,
            publicID: String
        }
    });

// Deleting flashcard also deletes the image from Cloudinary
flashcardSchema.post('findOneAndDelete', (card) => {
    if (card.image.publicID) {
        cloudinary.uploader.destroy(card.image.publicID, function(error,result) {
            //console.log("Delete Cloudinary image post-flashcard deletion :",result, error) 
        });
    }
    
})


const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports=Flashcard