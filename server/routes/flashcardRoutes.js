const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } = require('../controllers/flashcardController')

router.get("/", wrapAsync(getFlashcards))

router.post("/new", wrapAsync(createFlashcard))

router.patch("/:f_id", wrapAsync(updateFlashcard))

router.delete("/:f_id", wrapAsync(deleteFlashcard))

module.exports=router