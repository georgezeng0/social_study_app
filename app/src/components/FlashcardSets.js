import React, {useEffect} from 'react'
import { deleteSet,getSets, resetError, resetSuccess} from '../features/setSlice'
import { DeleteSetButton, SortFilterSets, Loading } from '../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateRoomWindow } from '../features/flashcardSlice'

const FlashcardSets = ({ chatRoom }) => {
    // chatRoom prop is true if component is in a chatroom

    const { sets, isLoading, error: { isError, status, message },
    success: { isSuccess, successMessage }    } = useSelector(state => state.set)
    const dispatch = useDispatch()

     // Fetch sets
     useEffect(() => {
        dispatch(resetError())
        dispatch(getSets())
     }, [dispatch])
    
    if ( isLoading ) {
        return <Loading/>
    }

    return (
      <>
        <div className='d-flex justify-content-center'>
                <SortFilterSets/>
        </div>

        <div className='row row-cols-1 row-cols-sm-2 row-cols-xl-4'>
          {sets.length==0 && <div className='text-muted text-center w-100'>No sets to show</div>}
            {sets.map(set => {
                const { name,_id,tags, isPublic, flashcards } = set
              return <div key={_id} className="p-1">
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="card-title w-100 d-flex">
                      <h5 className='d-inline mb-0'>{name}</h5>

                      {chatRoom ?
                        // If in chatroom view : button changes the view rather than routes
                      <>
                          <button
                            className="ms-auto btn btn-primary btn-sm"
                            onClick={() => dispatch(updateRoomWindow({ state: "SET", s_id: _id }))}>View</button>
                      </> : 
                      <>
                        <Link to={`/sets/${_id}`} className="ms-auto btn btn-primary btn-sm">View</Link>
                      </>
                    }
                
                    </div>
                    
                    <h6 className='card-subtitle text-muted mb-1'>{isPublic ? "Public" : "Private"}</h6>
                    <div>{tags.map((tag,i) => {
                      return <span className='badge bg-dark' key={i}>
                        {tag}
                      </span>
                    })}

                    </div>

                    <p className='pt-2 pb-0 mb-0'>
                      {flashcards.length} Flashcards
                    </p>
                  </div>
                </div>
                </div>
            })}
          </div>
          </>
  )
}

export default FlashcardSets