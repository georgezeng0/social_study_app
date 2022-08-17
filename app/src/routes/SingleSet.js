import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Flashcards, Loading } from '../components'
import { deleteSet, getSingleSet,resetError } from '../features/setSlice'
import Error from './Error'

const SingleSet = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedSet, error: { isError, message, status }, isLoading,
    success: { isSuccess, successMessage }
  } = useSelector(state => state.set)
  const { s_id } = useParams()
  
  // Reset any errors in the "set" redux store on page load
  useEffect(() => {
    dispatch(resetError())
  },[dispatch])

  // Fetch the set on page load.
  useEffect(() => {
      dispatch(getSingleSet(s_id))
  }, [dispatch])

  //Delete success message and redirect
  useEffect(() => {
    if (isSuccess && successMessage === "Set Deleted") {
      navigate('/flashcards')
    }
  }, [isSuccess,successMessage])
  
  const { name = '', stats = {}, tags=[], isPublic } = selectedSet
  const { numFlashcards } = stats

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
      <p>Number of flashcards: {numFlashcards}</p>
      <div>
        <h4>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet