import { configureStore } from '@reduxjs/toolkit'
import flashcardSlice from './features/flashcardSlice'
import setSlice from './features/setSlice'
import userSlice from './features/userSlice'

const store = configureStore({
    reducer: {
        flashcard: flashcardSlice,
        user: userSlice,
        set: setSlice
  }
})

export default store