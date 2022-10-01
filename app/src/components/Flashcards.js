import { useAuth0 } from '@auth0/auth0-react'
import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteFlashcard,setFlashcardsState,updateRoomWindow } from '../features/flashcardSlice'
import { getSingleSet, resetSelectedSet } from '../features/setSlice'
import getToken from '../utils/getToken'

const Flashcards = ({s_id_prop}) => {
    const { getAccessTokenSilently } = useAuth0()
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
        // chatroom window view
        if (s_id_prop) {
            setSetId(s_id_prop)
            if (flashcards_set.length===0) {
                dispatch(getSingleSet(s_id_prop))
            }
            else {
                setFlashcards(flashcards_set)
            }
        }
    }, [flashcards_, flashcards_set, dispatch, s_id, f_id, s_id_prop])
    
    const handleGoBack = () => {
        dispatch(updateRoomWindow({ state: "SETS", s_id: "" }))
        dispatch(resetSelectedSet())
    }

    const handleViewButton = (f_id) => {
        dispatch(setFlashcardsState("ORIGINAL"))
        dispatch(updateRoomWindow({state: "FLASHCARD", f_id:f_id}))
    }

  return (
      <section>
          {!s_id_prop &&
              <div>
                  <Link to={`/flashcards/create?set=${setId}`}>New Flashcard</Link>
              </div>
          }
          {s_id_prop &&
              <div>
                  <button onClick={handleGoBack}>Go Back</button>
          </div>
          }
          <div>
              {flashcards.length===0 && "No Flashcards in Set"}
              {flashcards && flashcards.map((flashcard,i) => {
                  const { _id, front, back, title, parentSet } = flashcard
                  return <div key={_id} className={`${_id===f_id?"bg-primary":""}`}>
                      <h4>{i + 1} - {title}</h4>
                      {s_id_prop ?
                          <button onClick={()=>handleViewButton(_id)}>View</button> :
                          <Link to={`/flashcards/${_id}`}>View</Link>
                    }
                      
                      {/* Edit/delete only when in "set" view */}
                      {s_id && <>
                          <Link to={`/flashcards/${_id}/edit`}>Edit</Link>
                          <button onClick={async () => {
                              const token = await getToken(getAccessTokenSilently)
                              dispatch(deleteFlashcard({ f_id: _id, s_id: parentSet,token }))
                          }}>Delete</button>
                      </>}
                  </div>
              })}
          </div>
    </section>
  )
}

export default Flashcards