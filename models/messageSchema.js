const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        body: {type: String, required: true},
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
        date: { type: Date, required: true },
        chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" , required: true}
    });

const Message = mongoose.model('Message', messageSchema);

module.exports=Message