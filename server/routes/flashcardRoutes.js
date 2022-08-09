const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard, getOneFlashcard } = require('../controllers/flashcardController')

router.get("/by_set/:s_id", wrapAsync(getFlashcards))

router.get("/:f_id", wrapAsync(getOneFlashcard))

router.post("/new/:s_id", wrapAsync(createFlashcard))

router.patch("/:f_id", wrapAsync(updateFlashcard))

router.delete("/:f_id", wrapAsync(deleteFlashcard))

module.exports=router