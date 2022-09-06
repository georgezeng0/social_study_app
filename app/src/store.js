import { configureStore,  } from '@reduxjs/toolkit'
import flashcardSlice from './features/flashcardSlice'
import setSlice from './features/setSlice'
import userSlice from './features/userSlice'
import chatSlice from './features/chatSlice'
import chatMiddleware from './utils/chatMiddleware'

const store = configureStore({
    reducer: {
        flashcard: flashcardSlice,
        user: userSlice,
        set: setSlice,
        chat: chatSlice
    },
  middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat([chatMiddleware])
    }
})

export default store