// Handles interaction with app DB and auth0 Management API
// Documentation for node-auth0: https://auth0.github.io/node-auth0/ManagementClient.html

const User = require('../../models/userSchema')
const { auth0 } = require('../utils/authorisation')

module.exports.getUser = async (req, res, next) => {
    const { u_id } = req.params
    const user = await User.find({ u_id}); 
    if (user.length > 0) {
        res.send(user)
    } else {
        const newUser = new User({ u_id })
        await newUser.save()
        res.send(newUser)
    }
}

// Get single user info from management API using user id
module.exports.managementAPI_getUser = async (req, res, next) => {
    const user = await auth0.getUser({ id: req.params.u_id })
    res.send(user)
}


