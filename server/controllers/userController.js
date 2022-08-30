// Handles interaction with app DB and auth0 Management API
// Documentation for node-auth0: https://auth0.github.io/node-auth0/ManagementClient.html
// Documentation for management API: https://auth0.com/docs/api/management/v2

const User = require('../../models/userSchema')
const { auth0 } = require('../utils/authorisation')

// Gets user information from application DB, if user exists. Otherwise create a new user in the DB.
// DB stores user info for application features, rather than using auth0 database which is more suited 
// for storing authentication related information.
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


