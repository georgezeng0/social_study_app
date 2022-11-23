import React, {useEffect, useState} from 'react'
import { getSets, resetError} from '../features/setSlice'
import { SortFilterSets, Loading } from '../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateRoomWindow } from '../features/flashcardSlice'

const FlashcardSets = ({ chatRoom }) => {
    // chatRoom prop is true if component is in a chatroom
  
  const dispatch = useDispatch()
  
    const { sets, isLoading, error: { isError, status, message },
      success: { isSuccess, successMessage } } = useSelector(state => state.set)
  const [page, setPage] = useState(0)   


     // Fetch sets
     useEffect(() => {
        dispatch(resetError())
        dispatch(getSets())
     }, [dispatch])
    
    if ( isLoading ) {
        return <Loading/>
  }
  
    // Front end pagination
    const numberPerPage = 10
    
    const prevPage = () => {
      if (page > 0) {
        setPage(page-1)
      }
    }
    const nextPage = () => {
      if (page < parseInt(sets.length/numberPerPage)-1) {
        setPage(page+1)
      }
    }

    return (
      <>
        <div className='d-flex justify-content-center'>
                <SortFilterSets/>
        </div>

        <div className="div d-flex justify-content-center mb-2">
          <div className="btn-group">
            <button className='btn btn-dark shadow-none' onClick={prevPage}>Prev</button>
            <b className='btn btn-disabled border-0 bg-dark text-white'>{page+1}</b>
            <button className='btn btn-dark shadow-none' onClick={nextPage}>Next</button>
          </div>
        </div>

        <div className='row row-cols-1 row-cols-sm-2 row-cols-xl-4 mb-5'>
          {sets.length==0 && <div className='text-muted text-center w-100'>No sets to show</div>}
          {sets.slice(page * numberPerPage, page * numberPerPage + numberPerPage)
            .map(set => {
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