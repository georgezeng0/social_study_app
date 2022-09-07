const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { createRoom, getRooms,joinRoom,leaveRoom,getOneChatRoom } = require('../controllers/chatController')

router.post("/", jwtCheck, wrapAsync(createRoom))

router.get("/", wrapAsync(getRooms))

router.get("/:c_id", jwtCheck, wrapAsync(getOneChatRoom))

router.post("/:c_id/join", jwtCheck, wrapAsync(joinRoom))

router.post("/:c_id/leave", jwtCheck, wrapAsync(leaveRoom))

module.exports=router