// const mongoose = require('mongoose');
const Set = require('../../models/setSchema');

module.exports.getSets = async (req, res, next) => {
    const sets = await Set.find(); 
    res.send(sets)
}

module.exports.createSet= async (req, res, next) => {
    const set = new Set(req.body); 
    await set.save()
    res.send({set, message: "Set created"})
}

module.exports.updateSet = async (req, res, next) => {
    const updatedSet = await Set.findByIdAndUpdate(
        req.params.s_id,
        req.body,
        { runValidators: true }
    )
    await updatedSet.save()
    res.send({
        oldSet: updatedSet,
        message: "Set updated"
    })
}

module.exports.deleteSet = async (req, res, next) => {
    const deletedSet= await Set.findByIdAndDelete(req.params.s_id)
    res.send({
        deletedSet: deletedSet,
        message: "Set deleted"
    })
}

module.exports.getSingleSet = async (req, res, next) => {
    const set = await Set.findById(req.params.s_id) 
    res.send(set)
}