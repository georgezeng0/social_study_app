import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { deleteFlashcard, getFlashcards } from '../features/flashcardSlice'

const Flashcards = () => {
    const { flashcards } = useSelector(state => state.flashcard)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getFlashcards())
    },[dispatch])

  return (
      <Wrapper>
          <div>
              <h1>Flashcards</h1>
              <Link to='/flashcards/create'>New Flashcard</Link>
          </div>
          <div>
              {flashcards.map(flashcard => {
                  const { _id, front, back } = flashcard
                  return <div key={_id}>
                      {front} - {back}
                      <Link to={`/flashcards/${_id}`}>View</Link>
                      <Link to={`/flashcards/${_id}/edit`}>Edit</Link>
                      <button onClick={()=>dispatch(deleteFlashcard(_id))}>Delete</button>
                  </div>
              })}
          </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`

`

export default Flashcards