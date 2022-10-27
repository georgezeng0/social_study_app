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
      <main className='container pb-5'>
        <div className='d-flex mb-3'>
          <Link to={`/sets/${card?.parentSet}`} className="btn btn-outline-dark btn-sm">Back to Set</Link>
      </div>
        {isPlaying && <PlayWindow />}
      <div className="container">
        <div className="row">
          <div className="col-12 col-xl-8">
            <Flashcard f_id={f_id} /></div>
         
          <div className="col">
              <Flashcards />
            </div>
          
          </div>
      </div>
      
    </main>
  )
}

export default SingleFlashcard