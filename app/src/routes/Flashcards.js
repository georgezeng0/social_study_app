import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { resetSuccess} from '../features/setSlice'
import {  FlashcardSets, MessageModal } from '../components'
import Error from './Error'

const Flashcards = () => {
    const {
        error: { isError, status, message },
        success: { isSuccess, successMessage, isLoading }} = useSelector(state => state.set)
    const dispatch = useDispatch()

    // Deleting a set will redirect to this route, need to reset the success notification
    useEffect(() => {
        if (isSuccess) {
            setTimeout(()=>dispatch(resetSuccess()),3000)
        }
    },[dispatch,isSuccess])

    if (isError) {
        return <Error status={status} message={message} />
    }

  return (
      <Wrapper className='container'>
          <div className='d-flex flex-column align-items-center'>
              <h1 className='text-center display-1'>Flashcard Sets</h1>
              <Link to='/sets/create' className={`btn btn-outline-dark mb-4 ${isLoading && 'disabled'}`}>New Set</Link>
          </div>
          <FlashcardSets/>

          {(successMessage) && <MessageModal message={successMessage} />}
          
    </Wrapper>
  )
}

const Wrapper = styled.main`

`

export default Flashcards