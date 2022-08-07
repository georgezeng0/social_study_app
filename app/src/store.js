import { configureStore } from '@reduxjs/toolkit'
import flashcardSlice from './features/flashcardSlice'
import userSlice from './features/userSlice'

const store = configureStore({
    reducer: {
        flashcard: flashcardSlice,
        user: userSlice
  }
})

export default store