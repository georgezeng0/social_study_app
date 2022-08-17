import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { deleteSet,getSets, resetError, resetSuccess} from '../features/setSlice'
import { Loading, MessageModal } from '../components'
import Error from './Error'

const Flashcards = () => {
    const { sets, isLoading, error: { isError, status, message },
    success: { isSuccess, successMessage }    } = useSelector(state => state.set)
    const dispatch = useDispatch()

    // Fetch sets
    useEffect(() => {
        dispatch(resetError())
        dispatch(getSets())
    }, [dispatch])

    // Deleting a set will redirect to this route, need to reset the success notification
    useEffect(() => {
        if (isSuccess) {
            setTimeout(()=>dispatch(resetSuccess()),3000)
        }
    },[dispatch,isSuccess])
    
    if (isLoading) {
        return <Loading/>
    }

    if (isError) {
        return <Error status={status} message={message} />
    }

  return (
      <Wrapper>
          <div>
              <h1>Sets</h1>
              <Link to='/sets/create'>New Set</Link>
          </div>
          <div>
              {sets.map(set => {
                  const { name,_id } = set
                  return <div key={_id}>
                      {name}
                      <Link to={`/sets/${_id}`}>View</Link>
                      <Link to={`/sets/${_id}/edit`}>Edit</Link>
                      <button onClick={()=>dispatch(deleteSet(_id))}>Delete</button>
                  </div>
              })}
          </div>

          {(successMessage) && <MessageModal message={successMessage} />}
          
    </Wrapper>
  )
}

const Wrapper = styled.main`

`

export default Flashcards