const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const {getUser, managementAPI_getUser,managementAPI_updateUser, updateUser } = require('../controllers/userController')

router.get("/:u_id", wrapAsync(getUser))

router.patch("/:u_id", jwtCheck, wrapAsync(updateUser))

router.get("/management/:u_id", jwtCheck, wrapAsync(managementAPI_getUser))

router.patch("/management/:u_id", jwtCheck, wrapAsync(managementAPI_updateUser))


module.exports=router