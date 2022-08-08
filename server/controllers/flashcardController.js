// const mongoose = require('mongoose');
const Flashcard = require('../../models/flashcardSchema');
const Set = require('../../models/setSchema');

// Gets flashcards for set ID
// May be redunent if can retrieve from a set with populate
module.exports.getFlashcards = async (req, res, next) => {
    const { s_id } = req.params
    const {flashcards} = await Set.findById(s_id).populate('flashcards'); 
    res.send(flashcards)
}

// Create flashcard within a set
module.exports.createFlashcard = async (req, res, next) => {
    const { s_id } = req.params
    const set = await Set.findById(s_id)
    const flashcard = new Flashcard(req.body); 
    set.flashcards.push(flashcard);
    flashcard.parentSet = set
    await set.save()
    await flashcard.save()
    
    res.send({flashcard, message: "Flashcard created"})
}

module.exports.updateFlashcard = async (req, res, next) => {
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
}

module.exports.deleteFlashcard = async (req, res, next) => {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.f_id)
    res.send({
        deletedFlashcard: deletedFlashcard,
        message: "Flashcard deleted"
    })
}