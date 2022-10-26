import { useAuth0 } from '@auth0/auth0-react'
import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteFlashcard,setFlashcardsState,updateRoomWindow } from '../features/flashcardSlice'
import { getSingleSet, resetSelectedSet } from '../features/setSlice'
import getToken from '../utils/getToken'
import { BsFillPlusCircleFill } from 'react-icons/bs'

const Flashcards = ({s_id_prop}) => {
    const { getAccessTokenSilently } = useAuth0()
    const { selectedSet: { flashcards: flashcards_set } } = useSelector(state => state.set)
    const { flashcards: flashcards_ } = useSelector(state => state.flashcard)
    const { user: {_id:userMongoID} } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [flashcards,setFlashcards] = useState([])
    const [setId, setSetId] = useState([])
    const [isOwner, setIsOwner] = useState(false)

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

    // Check if owner is viewing flashcards
    useEffect(() => {
        if (flashcards.length > 0) {
            const owner = flashcards[0].owner
            setIsOwner(owner===userMongoID)
        }
    }, [flashcards, userMongoID])
    
    const handleGoBack = () => {
        dispatch(updateRoomWindow({ state: "SETS", s_id: "" }))
        dispatch(resetSelectedSet())
    }

    const handleViewButton = (f_id) => {
        dispatch(setFlashcardsState("ORIGINAL"))
        dispatch(updateRoomWindow({state: "FLASHCARD", f_id:f_id}))
    }

  return (
      <section className='text-light'>
          {!s_id_prop &&
              <div className='text-center mb-2'>
                  <Link to={`/flashcards/create?set=${setId}`} className='fs-4'><BsFillPlusCircleFill/></Link>
              </div>
          }
          {s_id_prop &&
              <div>
                  <button onClick={handleGoBack}>Go Back</button>
              </div>
          }
          {s_id && <hr />}
          <div className='text-center row g-2'>
              {flashcards.length===0 &&    <span className='text-center'>No flashcards to show</span> }
              {flashcards && flashcards.map((flashcard,i) => {
                  const { _id, front, back, title, parentSet } = flashcard
                  return <div className='col-lg-6 col-xl-4' key={_id}>
                        <div  className={`${_id===f_id?"bg-primary":""} card text-black d-flex align-items-center overflow-hidden`}>
                            <h4 className='card-title py-3 px-2 mb-0'>{i + 1} - {title.slice(0,50)}</h4>
                            
                            {s_id_prop ?
                                <button onClick={()=>handleViewButton(_id)} className="btn btn-primary rounded-0 w-100">View</button> :
                                <Link to={`/flashcards/${_id}`} className="btn btn-secondary rounded-0 w-100">View</Link>
                                }
                            {/* Edit/delete only when in "set" view */}
                              {s_id && isOwner && <div className="btn-group-sm row w-100">
                                <span className='btn disabled btn-dark col rounded-0'>Owner Actions: </span>
                                <Link to={`/flashcards/${_id}/edit`} className="btn btn-light col rounded-0">Edit</Link>
                                <button onClick={async () => {
                                    const token = await getToken(getAccessTokenSilently)
                                    dispatch(deleteFlashcard({ f_id: _id, s_id: parentSet,token }))
                                }}
                                className="btn btn-danger col rounded-0"
                                >Delete</button>
                                </div>}
                            </div>
                         </div>
                      
              })}
          </div>
    </section>
  )
}

export default Flashcards