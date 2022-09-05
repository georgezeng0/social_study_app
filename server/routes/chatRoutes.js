const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { createRoom, getRooms } = require('../controllers/chatController')

router.post("/", jwtCheck, wrapAsync(createRoom))

router.get("/", wrapAsync(getRooms))

module.exports=router