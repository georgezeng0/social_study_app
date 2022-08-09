import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Flashcards } from '../components'
import { getSingleSet } from '../features/setSlice'

const SingleSet = () => {
  const dispatch = useDispatch()
  const { selectedSet } = useSelector(state=>state.set)
  const { s_id } = useParams()
  
  const {name='', stats:{numFlashcards}} = selectedSet

  useEffect(() => {
    if (selectedSet?._id !== s_id) {
      dispatch(getSingleSet(s_id))
    }
  }, [dispatch, s_id, selectedSet])
  
  return (
    <main>
      <h1>Flashcard Set</h1>
      <h3>Name: {name}</h3>
      <p>Number of flashcards: {numFlashcards}</p>
      <div>
        <h4>Flashcards</h4>
        <Flashcards/>
      </div>
    </main>
  )
}

export default SingleSet