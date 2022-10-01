import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Flashcard from './Flashcard'
import Flashcards from './Flashcards'
import FlashcardSets from './FlashcardSets'

const FlashcardRoomWindow = () => {
    const dispatch = useDispatch()
    const { roomWindow: { f_id, s_id, state } } = useSelector(state => state.flashcard)
    
    if (state === "SETS") {
        return (
            <div>
                <FlashcardSets chatRoom />
            </div>
        )
    }

    if (state === "SET") {
        return (
            <div>
                <Flashcards s_id_prop={s_id} />
            </div>
        )
    }

    if (state === "FLASHCARD") {
        return (
            <div>
                <Flashcard f_id={f_id} roomWindow />
            </div>
        )
    }
  
}

export default FlashcardRoomWindow