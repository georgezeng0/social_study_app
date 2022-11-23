import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { resetSuccess,resetError} from '../features/setSlice'
import {  FlashcardSets, MessageModal } from '../components'
import Error from './Error'
import { resetError as resetFlashcardError } from '../features/setSlice';

const Flashcards = () => {
    const {
        error: { isError, status, message },
        success: { isSuccess, successMessage, isLoading }} = useSelector(state => state.set)
    const dispatch = useDispatch()

    // Reset error if navigate to this route
    useEffect(() => {
    dispatch(resetError())
    dispatch(resetFlashcardError())
    }, [dispatch]) 

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
      <main className='container'>
          <div className='d-flex flex-column align-items-center'>
              <h1 className='text-center display-1'>Flashcard Sets</h1>
              <Link to='/sets/create' className={`btn btn-outline-dark mb-4 ${isLoading && 'disabled'}`}>New Set</Link>
          </div>
          <FlashcardSets/>

          {(successMessage) && <MessageModal message={successMessage} />}
          
    </main>
  )
}

export default Flashcards