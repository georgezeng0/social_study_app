import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { Flashcards } from '../components'
import { deleteSet, getSingleSet } from '../features/setSlice'

const SingleSet = () => {
  const dispatch = useDispatch()
  const { selectedSet } = useSelector(state=>state.set)
  const { s_id } = useParams()
  
  

  useEffect(() => {
    if (selectedSet?._id !== s_id) {
      dispatch(getSingleSet(s_id))
    }
  }, [dispatch, s_id, selectedSet])
  
  const { name = '', stats = {}, tags=[], isPublic } = selectedSet
  const { numFlashcards } = stats

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
      <button onClick={()=>dispatch(deleteSet(s_id ))}>Delete</button>
      <p>Number of flashcards: {numFlashcards}</p>
      <div>
        <h4>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet