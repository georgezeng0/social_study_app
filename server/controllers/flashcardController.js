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
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth

    const { s_id } = req.params
    const set = await Set.findById(s_id).populate('owner')

    // Check authorization
    if (auth_id === set.owner?.u_id || permissions.indexOf('admin')>-1) {
        const flashcard = new Flashcard(req.body);
        // Update parent set
        set.flashcards.push(flashcard);
        set.stats.numFlashcards += 1;
        flashcard.parentSet = set
        await set.save()
        await flashcard.save()
        res.send({ flashcard, message: "Flashcard created" })
    } else {
        res.status(401).send({ message: "Unauthorised"})
    }
}

module.exports.updateFlashcard = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    // Find flashcard to be updated
    let flashcard = await Flashcard.findById(req.params.f_id).populate('owner')
    // Check authorization
    if (auth_id === flashcard.owner?.u_id || permissions.indexOf('admin')>-1) {
        Object.keys(req.body).map(key => {
            flashcard[key]=req.body[key]
        })
        await flashcard.save()
        res.send({
            updatedFlashcard: flashcard,
            message: "Flashcard updated"
        })
    } else {
        res.status(401).send({ message: "Unauthorised"})
    }
    
}

module.exports.deleteFlashcard = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, populate } } = req.auth
    // Find flashcard to be deleted
    let flashcard = await Flashcard.findById(req.params.f_id).populate('owner')
    if (auth_id === flashcard.owner?.u_id || permissions.indexOf('admin')>-1) {
        const deletedFlashcard = await Flashcard.findOneAndDelete({ _id: req.params.f_id })
        const set = await Set.findById(deletedFlashcard.parentSet)
        set.stats.numFlashcards -= 1;
        await set.save()
        res.send({
            deletedFlashcard: deletedFlashcard,
            message: "Flashcard deleted"
        })
    } else {
        res.status(401).send({ message: "Unauthorised"})
    }
}