// Handles interaction with app DB and auth0 Management API
// Documentation for node-auth0: https://auth0.github.io/node-auth0/ManagementClient.html
// Documentation for management API: https://auth0.com/docs/api/management/v2

const mongoose = require('mongoose')
const User = require('../../models/userSchema')
const { auth0 } = require('../utils/authorisation')

// Gets user information from application DB, if user exists. Otherwise create a new user in the DB.
// DB stores user info for application features, rather than using auth0 database which is more suited 
// for storing authentication related information.
module.exports.getUser = async (req, res, next) => {
    const { u_id } = req.params
    const user = await User.find({ u_id }); 
    const { name, nickname, email } = req.body.auth0User
    if (user.length > 0) {
        const foundUser = user[0]
        // Overwrite name, nickname, email from auth-0 (as these can be changed outside mongoDB in auth0 API)
        foundUser.name = name
        foundUser.nickname = nickname
        foundUser.email = email
        await foundUser.save()
        res.send(foundUser)
    } else {
        const newUser = new User({ u_id, name, nickname, email })
        await newUser.save()
        res.send(newUser)
    }
}

// Updates database user values
module.exports.updateUser = async (req, res, next) => {
    const { u_id } = req.params
    // Get payload user id from req
    const { payload: { sub: auth_id } } = req.auth
    if (u_id === auth_id) {
        const user = await User.find({ u_id }); 
        if (user.length == 0) {
            res.status(500).send({message: "User ID not found"})
        }
        const FoundUser = user[0]
        Object.keys(req.body).map(key => {
            FoundUser[key]=req.body[key]
        })
        await FoundUser.save()
        res.send({
            updatedUser: FoundUser,
            message: "Database User updated"
        })
    } else {
        res.status(401).send({message: "Unauthorised"})
    }
    
}

// Get single user info from management API using user id
module.exports.managementAPI_getUser = async (req, res, next) => {
    // Get payload user id from req
    const { payload: { sub: auth_id } } = req.auth
    if (auth_id === req.params.u_id) {
        const user = await auth0.getUser({ id: req.params.u_id })
        res.send(user)
    } else {
        res.stats(401).send({message:"Unauthorised"})
    }
}

// Updates user using managementAPI using user id
// Example user object:
// {
//     "user_id": "auth0|507f1f77bcf86cd799439020",
//     "email": "john.doe@gmail.com",
//     "email_verified": false,
//     "username": "johndoe",
//     "phone_number": "+199999999999999",
//     "phone_verified": false,
//     "created_at": "",
//     "updated_at": "",
//     "identities": [
//       {
//         "connection": "Initial-Connection",
//         "user_id": "507f1f77bcf86cd799439020",
//         "provider": "auth0",
//         "isSocial": false
//       }
//     ],
//     "app_metadata": {},
//     "user_metadata": {},
//     "picture": "",
//     "name": "",
//     "nickname": "",
//     "multifactor": [
//       ""
//     ],
//     "last_ip": "",
//     "last_login": "",
//     "logins_count": 0,
//     "blocked": false,
//     "given_name": "",
//     "family_name": ""
//   }
module.exports.managementAPI_updateUser = async (req, res, next) => {
    const { payload: { sub: auth_id } } = req.auth
    if (auth_id === req.params.u_id) {
        const user = await auth0.updateUser(
            { id: req.params.u_id },
            req.body
        )
        res.send({ user, message: "User updated" })
    } else {
        res.status(401).send({message: "Unauthorised"})
    }
}

// Structure for setHistory property on User schema:
// setHistory: [{
//     set: { type: mongoose.Schema.Types.ObjectId, ref: "Set", required:true },
//     numberPlays: { type: Number, default: 0 },
//     sessions: [{
//         sessionEnd: { type: Date },
//         score: { type: Number, default: 0 },
//         totalCards: {type: Number, required: true}
//     }]
// }]

module.exports.saveGameHistory = async (req, res, next) => {
    const { payload: { sub: auth_id } } = req.auth
    const {s_id,score,totalCards,date} = req.body
    if (auth_id === req.params.u_id) {
        const searchUser = await User.find({ u_id: req.params.u_id })
        if (searchUser.length === 0) {
            res.status(500).send({ message: "User not found."})
        }
        const user=searchUser[0]
        // Convert objectID to string before comparing
        const historyIndex = user.setHistory.findIndex(item => item.set.toString() === s_id)

        // If set not in user history:
        if (historyIndex < 0) {
            user.setHistory.push({
                set: mongoose.Types.ObjectId(s_id),
                numberPlays: 1,
                sessions: [{
                    sessionEnd: date,
                    score: score,
                    totalCards: totalCards
                }]
            })
        }
        // Otherwise update that history
        else {
            oldHistory=user.setHistory[historyIndex]
            user.setHistory[historyIndex] = {
                set: oldHistory.set,
                numberPlays: oldHistory.sessions.length+1,
                sessions:
                    [...oldHistory.sessions,
                    {
                        sessionEnd: date,
                        score: score,
                        totalCards: totalCards
                    }
                    ]
            }
        }
        await user.save()
        res.send({ user, message: "User history updated" })
    } else {
        res.status(401).send({message: "Unauthorised"})
    }
}

module.exports.toggleFavSet = async (req, res, next) => {
    const { payload: { sub: auth_id } } = req.auth
    const { u_id, s_id } = req.params
    if (auth_id === u_id) {
        const searchUser = await User.find({ u_id })
        if (searchUser.length === 0) {
            res.status(500).send({ message: "User not found."})
        }
        const user = searchUser[0]
        const setObjectId = mongoose.Types.ObjectId(s_id)
        if (user.favSets.indexOf(setObjectId) > -1) {
            user.favSets.pull({_id: s_id})
        } else {
            user.favSets.push(setObjectId)
        }
        await user.save()
        res.send({
            user: user,
            message: "Favourite Sets Updated"
        })

    } else {
        res.status(401).send({message: "Unauthorised"})
    }
}