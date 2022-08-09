import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Flashcard } from '../components'

const SingleFlashcard = () => {
  const { f_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {activeCard: {card}} = useSelector(state=>state.flashcard)

  return (
    <main>
      <h1>Single Flashcard</h1>
      
      <div>
        <Flashcard f_id={f_id} />
      </div>
      <div>
        <Link to={`/sets/${card.parentSet}`}>Back to Set</Link>
      </div>
    </main>
  )
}

export default SingleFlashcard