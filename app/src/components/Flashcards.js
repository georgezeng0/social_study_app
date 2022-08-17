import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteFlashcard } from '../features/flashcardSlice'

const Flashcards = () => {
    const { selectedSet: { flashcards: flashcards_set } } = useSelector(state => state.set)
    const { flashcards: flashcards_ } = useSelector(state => state.flashcard)
    const dispatch = useDispatch()

    const [flashcards,setFlashcards] = useState([])
    const [setId,setSetId] = useState([])

    let { s_id, f_id } = useParams()
    
    // If component in set route, then take flashcards from set store. Otherwise take flashcards from flashcard store
    useEffect(() => {
        if (s_id) {
            setFlashcards(flashcards_set)
            setSetId(s_id)
        }
        if (f_id) {
            setFlashcards(flashcards_)
            setSetId(flashcards_[0]?.parentSet)
        }
    },[flashcards_,flashcards_set])

  return (
      <section>
          <div>
              <Link to={`/flashcards/create?set=${setId}`}>New Flashcard</Link>
          </div>
          <div>
              {flashcards && flashcards.map((flashcard,i) => {
                  const { _id, front, back, title, parentSet } = flashcard
                  return <div key={_id} className={`${_id===f_id?"bg-primary":""}`}>
                      <h4>{i+1} - {title}</h4>
                      <Link to={`/flashcards/${_id}`}>View</Link>
                      {/* Edit/delete only when in "set" view */}
                      {s_id && <>
                          <Link to={`/flashcards/${_id}/edit`}>Edit</Link>
                          <button onClick={() => dispatch(deleteFlashcard({ f_id: _id, s_id: parentSet }))}>Delete</button>
                      </>}
                  </div>
              })}
          </div>
    </section>
  )
}

export default Flashcards