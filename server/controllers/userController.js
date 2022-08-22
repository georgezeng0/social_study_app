const User = require('../../models/userSchema')

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