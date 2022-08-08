const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const { getSets, createSet, updateSet, deleteSet, getSingleSet } = require('../controllers/setController')

router.get("/", wrapAsync(getSets))

router.post("/new", wrapAsync(createSet))

router.patch("/:s_id", wrapAsync(updateSet))

router.delete("/:s_id", wrapAsync(deleteSet))

router.get("/:s_id", wrapAsync(getSingleSet))

module.exports=router