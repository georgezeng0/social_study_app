const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } = require('../controllers/flashcardController')

router.get("/:s_id", wrapAsync(getFlashcards))

router.post("/:s_id/new", wrapAsync(createFlashcard))

router.patch("/:f_id", wrapAsync(updateFlashcard))

router.delete("/:f_id", wrapAsync(deleteFlashcard))

module.exports=router