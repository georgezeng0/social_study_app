import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { DeleteSetButton, Flashcards, Loading, ToggleFavouriteSetButton } from '../components'
import {  getSingleSet, resetError } from '../features/setSlice'
import { playSet, setFlashcardsState, resetError as resetFlashcardError } from '../features/flashcardSlice'
import Error from './Error'
import { useAuth0 } from '@auth0/auth0-react'


const SingleSet = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loginWithPopup } = useAuth0();

  const {
    selectedSet, error: { isError, message, status }, isLoading,
    success: { isSuccess, successMessage }
  } = useSelector(state => state.set)
  const {
    activeCard: { card },
    gameMode: {isPlaying, savedCardWithIndex: {card: card_Saved}}
  } = useSelector(state => state.flashcard)
  const {
user: {setHistory, _id:userMongoID, isStoreLoading: userLoading}
  } = useSelector(state=>state.user)
  const { s_id } = useParams()
  const { name = '', stats = {}, tags=[], isPublic, flashcards } = selectedSet
  const { numFlashcards } = stats

  const [playButton, setPlayButton] = useState(false)
  const [history, setHistoryState] = useState({})
  
  // Reset any errors in the "set" redux store on page load
  useEffect(() => {
      dispatch(resetError())
      dispatch(resetFlashcardError())
  }, [dispatch])
  
  // find user history for set
  useEffect(() => {
    if (setHistory.length > 0) {
      setHistoryState(setHistory.find(history => history.set === s_id))
    }
  },[setHistory,s_id])

  // Fetch the set on page load after user info loaded
  useEffect(() => {
    if (!userLoading) {
      dispatch(getSingleSet(s_id))
    }
  }, [dispatch, s_id, userLoading])

  //Delete success message and redirect
  useEffect(() => {
    if (isSuccess && successMessage === "Set Deleted") {
      navigate('/flashcards')
    }
  }, [isSuccess,successMessage, navigate])
  
  //Navigate if play button pressed and active card state is updated
  useEffect(() => {
    if (playButton && card?._id) {
      navigate(`/flashcards/${card._id}`)
    }
  },[playButton, card, navigate])


  const playSetButton = () => {
    if (userMongoID) {
      dispatch(playSet(flashcards))
      setPlayButton(true)
    } else {
      loginWithPopup()
      //loginWithRedirect()
    }
  }

  const continueSessionButton = () => {
    dispatch(setFlashcardsState("SHUFFLED"))
    navigate(`/flashcards/${card_Saved?._id || card._id}`)
  }

  if (isLoading) {
    return <Loading/>
  }

  if (isError) {
    return <Error status={status} message={message} />
  }

  return (
    <main className='container pb-5'>
      <h1 className='text-center display-1'>{name}</h1>
      <hr />
      <h3 className='text-center display-6 text-muted'>{isPublic?"Public":"Private"} Flashcard Set</h3>
      <h5 className='rounded-pill bg-light border border-dark px-3 py-1'
      >Tags: {tags.map((tag, i) => {
        return <span className='badge bg-dark' key={i}>
        {tag}
      </span>
      })}</h5>
      {/* <h5>Public Set: {isPublic ? "Yes" : "No"}</h5> */}
      <div className="row mt-3">
        <div className="col-md text-center">

          {/* Owner actions */}
          {(userMongoID === selectedSet.owner || userMongoID==="638e1c42a9674a8109aed26c") &&
            <div className="btn-group d-block mb-2">
              <span className='btn disabled '>Owner Actions: </span>
              <Link to={`/sets/${s_id}/edit`} className="btn btn-primary">Edit</Link>
              <DeleteSetButton s_id={s_id} isLoading={isLoading} />
            </div>
          }
          

          <button onClick={playSetButton} className='btn btn-dark' disabled={numFlashcards===0}>Play Set</button>
          {isPlaying && 
            <button onClick={continueSessionButton} className='btn btn-dark'>Continue Session</button>
          }

          <div className='d-flex align-items-center justify-content-center my-1'>
          <ToggleFavouriteSetButton s_id={s_id} isLoading={isLoading} />
          </div>

          <p>Number of flashcards: {numFlashcards}</p>
        </div>

        <div className='col-md px-3'>
          <div className="card">
            <div className="card-body custom-scroll">
              <h4 className='card-title text-center'>Your History</h4>
              <p className="card-subtitle text-center mb-2">
                {userMongoID ?
                  <>Number of Plays: {history?.numberPlays || 0}</>:
                  "Log in to view"
                }
              </p>
              
              <div className='d-flex flex-column list-group' style={{maxHeight:"300px",overflowX:"hidden",overflowY:"auto"}}>
                {history && history.sessions && history.sessions.map((item,i) => {
                  return <div key={item._id} className={`list-group-item d-flex justify-content-between ${i%2===0 && "bg-light"}`} >
                    <span> Score - <b>{parseInt((item.score / item.totalCards) * 100)}%</b></span>
                    <span className="text-muted align-end">{new Date(item.sessionEnd).toLocaleDateString("en-GB")}</span>
                  </div>
                })}
              </div>
            </div>
            </div>
          </div>
      </div>

      <div className='rounded-4 border bg-dark p-3 mt-3'>
        <h4 className='text-white text-center'>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet