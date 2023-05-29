import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { Flashcard, Flashcards, PlayWindow } from '../components'

const SingleFlashcard = () => {
  const { f_id } = useParams()
  const { activeCard: { card }, gameMode: { isPlaying } } = useSelector(state => state.flashcard)

    return (
      <main className='container pb-5'>
        <div className='d-flex mb-3'>
          <Link to={`/sets/${card?.parentSet}`} className="btn btn-outline-dark btn-sm">Back to Set</Link>
      </div>
        {isPlaying && <div className='row'><div className="col"></div><PlayWindow/><div className="col"></div></div>}
      <div className="container">
        <div className="row">
          <div className="col-12 col-xl-8 mb-3">
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