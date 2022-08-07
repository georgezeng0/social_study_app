// const mongoose = require('mongoose');
const Flashcard = require('../../models/flashcardSchema');

module.exports.getFlashcards =async(req, res, next)=> {
    const flashcards = await Flashcard.find(); 
    res.send(flashcards)
}

module.exports.createFlashcard = async (req, res, next) => {
    const flashcard = new Flashcard(req.body); 
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