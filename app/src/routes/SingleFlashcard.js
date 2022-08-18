import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Flashcard, Flashcards, PlayWindow } from '../components'

const SingleFlashcard = () => {
  const { f_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {activeCard: {card}, gameMode: {isPlaying}} = useSelector(state=>state.flashcard)

    return (
      <main className='container mt-5'>
        {isPlaying && <PlayWindow />}
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8">
            <Flashcard f_id={f_id} /></div>
         
          <div className="col">
            <Flashcards /></div>
          
          </div>
      </div>
      <div>
        <Link to={`/sets/${card?.parentSet}`}>Back to Set</Link>
      </div>
    </main>
  )
}

export default SingleFlashcard