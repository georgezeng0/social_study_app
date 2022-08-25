const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { jwtCheck } = require('../utils/authorisation');

const { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard, getOneFlashcard } = require('../controllers/flashcardController')

router.get("/by_set/:s_id", wrapAsync(getFlashcards))

router.get("/:f_id", wrapAsync(getOneFlashcard))

router.post("/new/:s_id", jwtCheck, wrapAsync(createFlashcard))

router.patch("/:f_id", jwtCheck, wrapAsync(updateFlashcard))

router.delete("/:f_id", jwtCheck, wrapAsync(deleteFlashcard))

module.exports=router