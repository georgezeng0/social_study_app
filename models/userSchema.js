// This model stores user data not required for authentication
// Email and name are provided in Auth0 in the front end. 
// Passwords are handled by Auth0

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        u_id: { type: String, required: true }, // references the auth0 id
        icon: {
            color: { type: String, default: "#3297a8" },
            textColor: { type: String, default: "#ffffff" }
        },
        favSets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Set" }],
        setHistory: [{
            set: { type: mongoose.Schema.Types.ObjectId, ref: "Set", required:true },
            numberPlays: { type: Number, default: 0 },
            sessions: [{
                sessionEnd: { type: Date },
                score: { type: Number, default: 0 },
                totalCards: {type: Number, required: true}
            }]
        }]
    });

const User = mongoose.model('User', userSchema);

module.exports=User