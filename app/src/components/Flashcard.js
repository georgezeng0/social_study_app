import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteFlashcard, getOneFlashcard, setActiveCard } from '../features/flashcardSlice'
import styled from 'styled-components'

const Flashcard = ({ f_id }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { flashcards, activeCard: { card, index } } = useSelector(state => state.flashcard)
    const [nextCardId, setNextCardId] = useState('')
    const [prevCardId, setPrevCardId] = useState('')

    const [cardState, setCardState] = useState({
        showBack: false,
    })

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
      <Wrapper>
          <div>
              <button onClick={()=>navigate(`/flashcards/${f_id}/edit`)}> Edit </button>
              <button onClick={() => dispatch(deleteFlashcard(f_id))}> Delete </button>
              <button onClick={()=>setCardState({...cardState, showBack: !cardState.showBack})}>Toggle Answer</button>
          </div>

          <article className='front'>
              {card?.front}
          </article>

          <article className={`back ${cardState.showBack?'show':''}`}>
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
      </Wrapper>
  )
}

const Wrapper = styled.section`
.front{
    width: 400px;
    height: 300px;
    background-color: lightblue;
    padding: 20px;
    box-sizing: border-box;
}
.back{
    width: 400px;
    height: 300px;
    background-color: lightgreen;
    padding: 20px;
    box-sizing: border-box;
    display: none;
}
.show{
    display: block;
}
`

export default Flashcard