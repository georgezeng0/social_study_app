import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteFlashcard, getOneFlashcard, setActiveCard, updateRoomWindow } from '../features/flashcardSlice'
import styled from 'styled-components'
import dompurifyHTML from '../utils/dompurifyHTML'
import FlashcardForm from './FlashcardForm'
import Loading from './Loading'
import getToken from '../utils/getToken'
import { useAuth0 } from '@auth0/auth0-react'
import { HiOutlineChevronRight } from 'react-icons/hi'
import {FaChevronCircleRight,FaChevronCircleLeft} from 'react-icons/fa'

const Flashcard = ({ f_id, roomWindow }) => {
    const {getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { flashcards, originalFlashcards, activeCard: { card, index }, isLoading, gameMode: {isPlaying, score} } = useSelector(state => state.flashcard)
    const {user: {_id: userMongoId}} = useSelector(state=>state.user)

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
            setCardFront(card?.back)
            setCardBack(card?.front)
        } else {
            setCardFront(card?.front)
            setCardBack(card?.back)
        }
    },[f_id,card])

    // Gets flashcard every time if not playing
    useEffect(() => {
        if (!isPlaying) {
            dispatch(getOneFlashcard(f_id))
        }
    }, [dispatch, f_id, isPlaying])

    useEffect(() => {
        if (flashcards) {
            dispatch(setActiveCard({ f_id, roomWindow }))
        }
    }, [dispatch, flashcards, f_id])
    
    // Logic for next/ previous card buttons
    useEffect(() => {
        if (flashcards.length && card?._id===f_id) {
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

    const handleNextCard = () => {
        if (roomWindow) {
            dispatch(updateRoomWindow({ f_id: nextCardId }))
        } else {
            navigate(`/flashcards/${nextCardId}`)
        }
    }

    const handlePrevCard = () => {
        if (roomWindow) {
            dispatch(updateRoomWindow({ f_id: prevCardId }))
        } else {
            navigate(`/flashcards/${prevCardId}`)
        }
    }

    const handleGoBack = () => {
        dispatch(updateRoomWindow({ state: "SET", f_id: "", s_id: card.parentSet }))
        
    }

    // if (isLoading) {
    //     return <main className='container mt-5'>
    //       <Loading/>
    //     </main>
    // }
    


  return (
      <Wrapper>
          {roomWindow &&
              <button onClick={handleGoBack} className='btn btn-dark'>Go Back</button>
          }
          <h1 className=''><span className='text-dark'>{index + 1}/{flashcards.length}</span> <HiOutlineChevronRight className='text-dark' style={{bottom:"3px",position:"relative"}}></HiOutlineChevronRight> {card?.title ? card.title : "Untitled"}</h1>
          <hr />
          <div className='row g-1'>
              <div className="col"></div>
              <button disabled={prevCardId.length===0}
                onClick={handlePrevCard} className='btn border-0 text-dark col'>
                  <FaChevronCircleLeft className='fs-1'></FaChevronCircleLeft>
              </button>
              <div className="col-auto d-flex justify-content-start align-items-center text-muted" style={{width:"100px"}}>
                  Prev
              </div>
              <div className="col-auto d-flex justify-content-end align-items-center text-muted"  style={{width:"100px"}}>
                  Next
              </div>
              <button disabled={nextCardId.length===0}
                onClick={handleNextCard} className='btn border-0 text-dark col'>
                  <FaChevronCircleRight className='fs-1'></FaChevronCircleRight>
              </button>
              <div className="col"></div>
              </div> 
          <div>
              {/* <h5>Reversible: {card?.reversible?'Yes':'No'}</h5> */}
              <h5 className='text-center'>Difficulty : {card?.stats?.difficulty}</h5>
          </div>

          <div className='d-flex flex-column align-items-center mt-2'>
              {!roomWindow && userMongoId === card?.owner && <>
                  <div className="btn-group btn-group-sm">
                        <span className='btn disabled'>Owner actions : </span>
                        <button onClick={()=>navigate(`/flashcards/${f_id}/edit`)} className="btn btn-primary"> Edit </button>
                        <button onClick={async () => {
                        const token = await getToken(getAccessTokenSilently)
                        dispatch(deleteFlashcard({ f_id, s_id: card.parentSet, token }))
                        if (nextCardId) {
                            navigate(`/flashcards/${nextCardId}`)
                        } else if (prevCardId) {
                            navigate(`/flashcards/${prevCardId}`)
                        } else {
                            navigate(`/sets/${card.parentSet}`)
                        }
                      }}
                          className="btn btn-danger"
                      > Delete </button>
                  </div>
                
              </>}
              
          </div>

          <div className={`${card?.image?.url ? "card":""}`}>
              <img src={card?.image?.url} alt="" className="card-image" />
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
          
                  <div className="d-flex justify-content-center">
          <button className='btn btn-lg btn-outline-dark my-3'
                  onClick={() => setCardState({ ...cardState, flip: !cardState.flip })}>Flip Card</button>
              
            </div>

          <div className="row mt-3">
              <div className="col"></div>
            <button className='btn btn-light border ms-auto col'
              onClick={() => setCardState({ ...cardState, showNotes: !cardState.showNotes })}>Show/Hide Notes</button>
                  <div className="col"></div>
          </div>

        <div className={`_notes container ${cardState.showNotes ? 'd-block' : 'd-none'}`} >
            <h5 className='display-6'>Notes</h5>
           
                  
              
            {!isPlaying && !roomWindow && showEditNotes ?
                <FlashcardForm formType="formEdit" editNotesOnly={true} setShowEditNotes={setShowEditNotes} roomWindow /> :
                <p dangerouslySetInnerHTML={{ __html: dompurifyHTML(card?.notes) }}
                      className='p-2 border'
                      style={{minHeight:"100px"}}
                ></p>
          }
              <button onClick={() => setShowEditNotes(!showEditNotes)} className="btn btn-dark mt-1">
              {showEditNotes ? "Cancel Editing" : "Edit Notes"}</button>
              
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