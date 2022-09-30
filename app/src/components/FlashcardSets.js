import React, {useEffect} from 'react'
import { deleteSet,getSets, resetError, resetSuccess} from '../features/setSlice'
import { DeleteSetButton, SortFilterSets, Loading } from '../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

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
    <div>
            <SortFilterSets />
    </div>
          <div>
              {sets.map(set => {
                  const { name,_id } = set
                  return <div key={_id}>
                      {name}
                      <Link to={`/sets/${_id}`}>View</Link>
                      <Link to={`/sets/${_id}/edit`}>Edit</Link>
                      <DeleteSetButton s_id={_id} isLoading={isLoading}/>
                  </div>
              })}
            </div>
            </>
  )
}

export default FlashcardSets