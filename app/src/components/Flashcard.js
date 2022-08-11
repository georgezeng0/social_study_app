import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteFlashcard, getOneFlashcard, setActiveCard } from '../features/flashcardSlice'
import styled from 'styled-components'
import dompurifyHTML from '../utils/dompurifyHTML'
import FlashcardForm from './FlashcardForm'

const Flashcard = ({ f_id }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { flashcards, activeCard: { card, index } } = useSelector(state => state.flashcard)

    const [nextCardId, setNextCardId] = useState('')
    const [prevCardId, setPrevCardId] = useState('')
    const [cardFront, setCardFront] = useState('')
    const [cardBack, setCardBack] = useState('')
    const [showEditNotes,setShowEditNotes] = useState(false)
    const [cardState, setCardState] = useState({
        flip: false,
        showNotes: false
    })

    // Reset notes show on card change. Flip is not reset, but content shown varies on flip state.
    // So that the front card is always shown first
    useEffect(() => {
        setCardState({
            // flip: false,
            ...cardState,
            showNotes: false
        })
        if (cardState.flip) {
            setCardFront(card.back)
            setCardBack(card.front)
        } else {
            setCardFront(card.front)
            setCardBack(card.back)
        }
    },[f_id,card])

    // Gets the list of flashcards in the set, if flashcards already in the store, then set activec card to selected card
    useEffect(() => {
        if (!flashcards.length) {
            dispatch(getOneFlashcard(f_id))
        } else {
            dispatch(setActiveCard(f_id))
        }
    }, [dispatch, flashcards, f_id])
    
    // Logic for next/ previous card buttons
    useEffect(() => {
        if (flashcards.length && card._id===f_id) {
            const n = flashcards.length
            if (index > 0 && index < n - 1) {
                setPrevCardId(flashcards[index - 1]._id)
                setNextCardId(flashcards[index+1]._id)
            }
            if (index === 0 && n>1) {
                setPrevCardId('')
                setNextCardId(flashcards[index+1]._id)
            }
            if (index === n - 1 && n>1) {
                setPrevCardId(flashcards[index - 1]._id)
                setNextCardId('')
            }
        }
    }, [card, index, flashcards])

  return (
      <Wrapper>
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
          <div>
              <h5>Reversible: {card?.reversible?'Yes':'No'}</h5>
              <h5>Difficulty: {card?.stats?.difficulty}</h5>
          </div>

          <div>
              <button onClick={()=>navigate(`/flashcards/${f_id}/edit`)}> Edit </button>
              <button onClick={() => dispatch(deleteFlashcard(f_id))}> Delete </button>
              <button onClick={()=>setCardState({...cardState, flip: !cardState.flip})}>Flip Card</button>
              <button onClick={()=>setCardState({...cardState, showNotes: !cardState.showNotes})}>Show/Hide Notes</button>
          </div>

          <div className={`_flip-card `}>
              <div className={`_flip-card-inner ${cardState.flip?"_flip-action":''}`}>
              {/* Flip Card container for animation */}
        <div className="card _flip-front">
          <article className='card-body container' dangerouslySetInnerHTML={{__html: dompurifyHTML(cardFront)}}>
              </article>
          </div>

          <div className={`card _flip-back`}>
          <article className={`card-body container`} dangerouslySetInnerHTML={{__html: dompurifyHTML(cardBack)}}>
              </article>
              </div></div></div>

              
                  
              <div className={`_notes container ${cardState.showNotes ? 'd-block' : 'd-none'}`} >
              <h5 className='display-6 border-bottom'>Notes</h5>
              <button onClick={() => setShowEditNotes(!showEditNotes)}>
                  {showEditNotes ? "Cancel Editing":"Edit Notes"}</button>
              {showEditNotes ?
                  <FlashcardForm formType="formEdit" editNotesOnly={true} /> :
                  <p dangerouslySetInnerHTML={{ __html: dompurifyHTML(card.notes) }}
                      className='p-2'
                  ></p>
              }
              </div>

              
      </Wrapper>
  )
}

const Wrapper = styled.section`
._flip-card{
    background-color: transparent;
    perspective: 5000px;
    height: 400px;
}
._flip-card-inner{
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.7s;
    transform-style: preserve-3d;
}
._flip-front,._flip-back{
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
 }

._flip-back{
    transform: rotateY(180deg);
}
._flip-action{
  transform: rotateY(180deg);
}
.card{
    height: 100%;
    width: 100%;
}
._notes{

}
`

export default Flashcard