import { configureStore } from '@reduxjs/toolkit'
import flashcardSlice from './features/flashcardSlice'
import setSlice from './features/setSlice'
import userSlice from './features/userSlice'
import chatSlice from './features/chatSlice'

const store = configureStore({
    reducer: {
        flashcard: flashcardSlice,
        user: userSlice,
        set: setSlice,
        chat: chatSlice
  }
})

export default store