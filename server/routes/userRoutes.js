const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const {getUser, managementAPI_getUser,managementAPI_updateUser, updateUser,saveGameHistory } = require('../controllers/userController')

router.get("/:u_id", wrapAsync(getUser))

router.patch("/:u_id", jwtCheck, wrapAsync(updateUser))

router.post("/:u_id/saveGameHistory", jwtCheck, wrapAsync(saveGameHistory))

router.get("/management/:u_id", jwtCheck, wrapAsync(managementAPI_getUser))

router.patch("/management/:u_id", jwtCheck, wrapAsync(managementAPI_updateUser))



module.exports=router