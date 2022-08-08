import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteFlashcard } from '../features/flashcardSlice'

const Flashcards = () => {
    const { selectedSet: { flashcards } } = useSelector(state => state.set)
    const dispatch = useDispatch()

    const {s_id} = useParams()

  return (
      <section>
          <div>
              <Link to={`/flashcards/create?set=${s_id}`}>New Flashcard</Link>
          </div>
          <div>
              {flashcards && flashcards.map(flashcard => {
                  const { _id, front, back } = flashcard
                  return <div key={_id}>
                      {front} - {back}
                      <Link to={`/flashcards/${_id}`}>View</Link>
                      <Link to={`/flashcards/${_id}/edit`}>Edit</Link>
                      <button onClick={()=>dispatch(deleteFlashcard(_id))}>Delete</button>
                  </div>
              })}
          </div>
    </section>
  )
}

export default Flashcards