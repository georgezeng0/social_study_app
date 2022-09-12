const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { getUser, managementAPI_getUser, managementAPI_updateUser,
    updateUser, saveGameHistory, toggleFavSet } = require('../controllers/userController')

router.post("/:u_id", wrapAsync(getUser))

router.patch("/:u_id", jwtCheck, wrapAsync(updateUser))

router.get("/:u_id/toggleFavSet/:s_id", jwtCheck, wrapAsync(toggleFavSet))

router.post("/:u_id/saveGameHistory", jwtCheck, wrapAsync(saveGameHistory))

router.get("/management/:u_id", jwtCheck, wrapAsync(managementAPI_getUser))

router.patch("/management/:u_id", jwtCheck, wrapAsync(managementAPI_updateUser))



module.exports=router