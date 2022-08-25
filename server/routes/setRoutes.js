const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { getSets, createSet, updateSet, deleteSet, getSingleSet } = require('../controllers/setController')

router.get("/", wrapAsync(getSets))

router.post("/new",jwtCheck, wrapAsync(createSet))

router.patch("/:s_id",jwtCheck, wrapAsync(updateSet))

router.delete("/:s_id",jwtCheck, wrapAsync(deleteSet))

router.get("/:s_id", wrapAsync(getSingleSet))

module.exports=router