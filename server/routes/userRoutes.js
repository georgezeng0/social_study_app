const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const {getUser } = require('../controllers/userController')

router.get("/:u_id", wrapAsync(getUser))


module.exports=router