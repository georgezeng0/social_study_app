const mongoose = require('mongoose');
const Messages = require('./messageSchema')

const chatSchema = new mongoose.Schema(
    {
        title: { type: String, default: "Untitled Room" },
        isPublic: { type: Boolean, default: false },
        passcode: { type: String, select: false }, // will not be returned on query unless selected via .select('+passcode')
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        users: [{
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                socketID: [{type: String}]
        }],
        videoId: String
    });

// Cascade - deleting chatroom will delete its messages 
chatSchema.post('findOneAndDelete', async (chat) => {
    const messages=chat.messages
    if (messages.length > 0) {
        await Messages.deleteMany({ _id: { $in: messages } })
    }
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports=Chat