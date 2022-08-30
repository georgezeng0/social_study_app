// This model stores user data not required for authentication
// Email and name are provided in Auth0 in the front end. 
// Passwords are handled by Auth0

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        u_id: { type: String, required: true }, // references the auth0 id
        favSets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Set" }],
        icon: {
            color: { type: String, default: "#3297a8" },
            textColor: { type: String, default: "#ffffff" }
        }
    });

const User = mongoose.model('User', userSchema);

module.exports=User