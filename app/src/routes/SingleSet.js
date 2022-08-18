import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Flashcards, Loading } from '../components'
import { deleteSet, getSingleSet, resetError } from '../features/setSlice'
import { playSet } from '../features/flashcardSlice'
import Error from './Error'

const SingleSet = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedSet, error: { isError, message, status }, isLoading,
    success: { isSuccess, successMessage }
  } = useSelector(state => state.set)
  const { activeCard: { card } } = useSelector(state=>state.flashcard)
  const { s_id } = useParams()
  const { name = '', stats = {}, tags=[], isPublic, flashcards } = selectedSet
  const { numFlashcards } = stats

  const [playButton, setPlayButton] = useState(false)
  
  // Reset any errors in the "set" redux store on page load
  useEffect(() => {
    dispatch(resetError())
  },[dispatch])

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
      <button disabled={isLoading} onClick={()=>dispatch(deleteSet(s_id ))}>Delete</button>
      <button onClick={playSetButton}>Play Set</button>
      <p>Number of flashcards: {numFlashcards}</p>
      <div>
        <h4>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet