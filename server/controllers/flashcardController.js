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

// Get single flashcard
module.exports.getOneFlashcard = async (req, res, next) => {
    const { f_id } = req.params;
    const flashcard = await Flashcard.findById(f_id);
    res.send(flashcard);
}

// Create flashcard within a set
module.exports.createFlashcard = async (req, res, next) => {
    const { s_id } = req.params
    const set = await Set.findById(s_id)
    const flashcard = new Flashcard(req.body); 
    set.flashcards.push(flashcard);
    set.stats.numFlashcards += 1;
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
    const deletedFlashcard = await Flashcard.findOneAndDelete({ _id: req.params.f_id })
    const set = await Set.findById(deletedFlashcard.parentSet)
    set.stats.numFlashcards -= 1;
    await set.save()
    res.send({
        deletedFlashcard: deletedFlashcard,
        message: "Flashcard deleted"
    })
}