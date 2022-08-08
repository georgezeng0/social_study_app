import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { deleteFlashcard, getFlashcards } from '../features/flashcardSlice'
import { deleteSet,getSets} from '../features/setSlice'

const Flashcards = () => {
    const { flashcards } = useSelector(state => state.flashcard)
    const { sets } = useSelector(state => state.set)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getFlashcards())
        dispatch(getSets())
    },[dispatch])

  return (
      <Wrapper>
          <div>
              <h1>Sets</h1>
              <Link to='/sets/create'>New Set</Link>
          </div>
          <div>
              {sets.map(set => {
                  const { name,_id } = set
                  return <div key={_id}>
                      {name}
                      <Link to={`/sets/${_id}`}>View</Link>
                      <Link to={`/sets/${_id}/edit`}>Edit</Link>
                      <button onClick={()=>dispatch(deleteSet(_id))}>Delete</button>
                  </div>
              })}
          </div>


          <div>
              <h1>Flashcards - Likely only get flashcards per set</h1>
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