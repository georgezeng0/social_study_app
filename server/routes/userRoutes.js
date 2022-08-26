const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const {getUser, managementAPI_getUser } = require('../controllers/userController')

router.get("/:u_id", wrapAsync(getUser))

router.get("/management/:u_id", wrapAsync(managementAPI_getUser))

module.exports=router