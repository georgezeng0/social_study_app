import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Flashcard } from '../components'

const SingleFlashcard = () => {
  const { f_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {activeCard: {card, index}, flashcards} = useSelector(state=>state.flashcard)

  return (
    <main className='container mt-5'>
      <h1>{index + 1}/{flashcards.length} - {card.title}</h1>
      
      
      <Flashcard f_id={f_id} />
      
      <div>
        <Link to={`/sets/${card.parentSet}`}>Back to Set</Link>
      </div>
    </main>
  )
}

export default SingleFlashcard