import React from 'react'
import { useSelector } from 'react-redux'
import Flashcard from './Flashcard'
import Flashcards from './Flashcards'
import FlashcardSets from './FlashcardSets'

const FlashcardRoomWindow = () => {
    // Acts as a route within a component - allows viewing of 3 components without routing url
    
    const { roomWindow: { f_id, s_id, state } } = useSelector(state => state.flashcard)
    
    if (state === "SETS") {
        return (
            <div className='container'>
                <FlashcardSets chatRoom />
            </div>
        )
    }

    if (state === "SET") {
        return (
            <div className='container'>
                <Flashcards s_id_prop={s_id} />
            </div>
        )
    }

    if (state === "FLASHCARD") {
        return (
            <div className='container row'>
                <div className="col-xl"></div>
                <div className="col-xl-8">
                    <Flashcard f_id={f_id} roomWindow />
                </div>
                <div className="col-xl"></div>
            </div>
        )
    }
  
}

export default FlashcardRoomWindow