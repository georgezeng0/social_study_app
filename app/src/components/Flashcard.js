import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getOneFlashcard, setActiveCard } from '../features/flashcardSlice'

const Flashcard = ({ f_id }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { flashcards, activeCard: { card, index } } = useSelector(state => state.flashcard)
    const [nextCardId, setNextCardId] = useState('')
    const [prevCardId, setPrevCardId] = useState('')

    useEffect(() => {
        if (!flashcards.length) {
            dispatch(getOneFlashcard(f_id))
        } else {
            dispatch(setActiveCard(f_id))
        }
    }, [dispatch, flashcards, f_id])
    
    useEffect(() => {
        if (flashcards.length && card._id===f_id) {
            const n = flashcards.length
            if (index > 0 && index < n - 1) {
                setPrevCardId(flashcards[index - 1]._id)
                setNextCardId(flashcards[index+1]._id)
            }
            if (index === 0) {
                setPrevCardId('')
                setNextCardId(flashcards[index+1]._id)
            }
            if (index === n - 1) {
                setPrevCardId(flashcards[index - 1]._id)
                setNextCardId('')
            }
        }
    }, [card, index, flashcards])

  return (
      <section>
          <article>
              {card?.front}
          </article>
          <article>
              {card?.back}
          </article>
          <div>
              <button disabled={prevCardId.length===0}
                onClick={() => navigate(`/flashcards/${prevCardId}`)}>
                  Previous
              </button>
              <button disabled={nextCardId.length===0}
                onClick={() => navigate(`/flashcards/${nextCardId}`)}>
                  Next
              </button>
              
          </div>
      </section>
  )
}

export default Flashcard