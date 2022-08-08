import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { deleteSet,getSets} from '../features/setSlice'

const Flashcards = () => {
    const { sets } = useSelector(state => state.set)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSets())
    },[dispatch])

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


          
    </Wrapper>
  )
}

const Wrapper = styled.main`

`

export default Flashcards