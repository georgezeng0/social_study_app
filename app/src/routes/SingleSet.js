import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { DeleteSetButton, Flashcards, Loading, ToggleFavouriteSetButton } from '../components'
import {  getSingleSet, resetError } from '../features/setSlice'
import { playSet, setFlashcardsState } from '../features/flashcardSlice'
import Error from './Error'

const SingleSet = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    selectedSet, error: { isError, message, status }, isLoading,
    success: { isSuccess, successMessage }
  } = useSelector(state => state.set)
  const {
    activeCard: { card },
    gameMode: {isPlaying, savedCardWithIndex: {card: card_Saved}}
  } = useSelector(state => state.flashcard)
  const {
user: {setHistory}
  } = useSelector(state=>state.user)
  const { s_id } = useParams()
  const { name = '', stats = {}, tags=[], isPublic, flashcards } = selectedSet
  const { numFlashcards } = stats

  const [playButton, setPlayButton] = useState(false)
  const [history, setHistoryState] = useState({})
  
  // Reset any errors in the "set" redux store on page load
  useEffect(() => {
    dispatch(resetError())
  }, [dispatch])
  
  // find user history for set
  useEffect(() => {
    if (setHistory.length > 0) {
      setHistoryState(setHistory.find(history => history.set === s_id))
    }
  },[setHistory])

  // Fetch the set on page load.
  useEffect(() => {
      dispatch(getSingleSet(s_id))
  }, [dispatch, s_id])

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
    dispatch(playSet(flashcards))
    setPlayButton(true)
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
    <main>
      <h1>Flashcard Set</h1>
      <h3>Name: {name}</h3>
      <h5>Tags: {tags.map((tag, i) => {
        if (i<tags.length-1) return ` ${tag},`
        else return ` ${tag}`
      })}</h5>
      <h5>Public Set: {isPublic ? "Yes" : "No"}</h5>
      <Link to={`/sets/${s_id }/edit`}>Edit</Link>
      <DeleteSetButton s_id={s_id} isLoading={isLoading} />
      <button onClick={playSetButton}>Play Set</button>
      {isPlaying && 
        <button onClick={continueSessionButton}>Continue Session</button>
      }

      Toggle Favourite: <ToggleFavouriteSetButton s_id={s_id} isLoading={isLoading} />
      
      <p>Number of flashcards: {numFlashcards}</p>
      
      <div>
        <h4>Your History:</h4>
        Plays: {history? history.numberPlays:0}
        <div>
          {history && history.sessions && history.sessions.map(item => {
            return <p key={item._id}>
              Score - {parseInt((item.score / item.totalCards) * 100)}% - Date: {item.sessionEnd}
            </p>
          })}
        </div>
      </div>
      
      <div>
        <h4>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet