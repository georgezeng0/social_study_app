const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { createRoom, getRooms,joinRoom,leaveRoom,getOneChatRoom,createMessage,editChatRoom, deleteChatRoom } = require('../controllers/chatController')

router.post("/", jwtCheck, wrapAsync(createRoom))

router.get("/", wrapAsync(getRooms))

router.get("/:c_id", jwtCheck, wrapAsync(getOneChatRoom))

router.patch("/:c_id", jwtCheck, wrapAsync(editChatRoom))

router.delete("/:c_id", jwtCheck, wrapAsync(deleteChatRoom))

router.post("/:c_id/join", jwtCheck, wrapAsync(joinRoom))

router.post("/:c_id/leave", jwtCheck, wrapAsync(leaveRoom))

router.post("/:c_id/message", jwtCheck, wrapAsync(createMessage))

module.exports=router