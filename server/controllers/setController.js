// const mongoose = require('mongoose');
const Set = require('../../models/setSchema');
const User = require('../../models/userSchema');
const AppError = require('../utils/appError');

module.exports.getSets = async (req, res, next) => {
    let { search = "", tags = "", isFavourite = "",user="" } = req.query
    let sets = await Set.find(
        {
            name: { "$regex": search, "$options": "i" },
            tags:
                tags ? { "$in": tags } :
                    /.*/g, // Regex to match anything if no tags in search query
        }
    );
    if (user) {
        [user] = await User.find({_id: user })//user id is passed here rather than "isFavourite" boolean which is True if id is truthy
    }
    if (isFavourite ) {
        // Filter for user favourite
        if (sets.length > 0 && user) {
            const favSets = user.favSets
            sets = sets.filter(set => {
                return favSets.indexOf(set._id) > -1
            })
        }
    }
    // Filter private sets
    sets = sets.filter(set => {
        return set.owner.toString()===(user && user._id.toString()) || set.isPublic
    })

    res.send(sets)
}

module.exports.createSet = async (req, res, next) => {
    const set = new Set(req.body); 
    await set.save()
    res.send({set, message: "Set created"})
}

module.exports.updateSet = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id, permissions } } = req.auth
    // Find the set for editing
    let set = await Set.findById(req.params.s_id).populate('owner')
    // Check if user is authorised (the owner of the set) or if admin
    if (auth_id === set.owner?.u_id || permissions.indexOf('admin')>-1) {
        Object.keys(req.body).map(key => {
            set[key]=req.body[key]
        })
        await set.save()
        res.send({
            oldSet: set,
            message: "Set updated"
        })
    } else {
        res.status(401).send({message: "Unauthorised"})
    }
    
}

module.exports.deleteSet = async (req, res, next) => {
     // Get payload user id from req
     const { payload: { sub: auth_id, permissions } } = req.auth
     // Find the set for deleting
     const set = await Set.findById(req.params.s_id).populate('owner')
     // Check if user is authorised (the owner of the set)
    if (auth_id === set.owner?.u_id || permissions.indexOf('admin')>-1) {
        // Uses findOneAndDelete due to middleware that cascades the flashcard children
        const deletedSet = await Set.findOneAndDelete({ _id: req.params.s_id })
        res.send({
            deletedSet: deletedSet,
            message: "Set deleted"
        })
    }
    else {
        res.status(401).send({message: "Unauthorised"})
    }
}

module.exports.getSingleSet = async (req, res, next) => {
    const set = await Set.findById(req.params.s_id).populate('flashcards') 
    let {user="" } = req.query
    if (!set) {
        // If Set not found
        return next(new AppError(404, "Set not found."))
    }
    else if(set.isPublic === false && set.owner.toString() !== user) {
        // If Set is private and user not owner
        return next(new AppError(401, "Private Set - Unauthorised."))
    }
    res.send(set)
}