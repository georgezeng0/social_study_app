import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { createFlashcard, updateForm, resetForm, editFlashcard } from '../features/flashcardSlice'


const FlashcardForm = ({formType}) => {
    const dispatch = useDispatch()
  const { f_id } = useParams();
  const [searchParams, _] = useSearchParams();
  const s_id = searchParams.get("set")
  const { front, back } = useSelector(state => state.flashcard[formType])

  const handleSubmit = (e) => {
        e.preventDefault()
        if (formType === 'formNew') {
            dispatch(createFlashcard(s_id))
            dispatch(resetForm({ formType }))
        } 
        if (formType === 'formEdit') {
            dispatch(editFlashcard(f_id))
            dispatch(resetForm({ formType }))
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateForm({formType,name, value}))
    }

  return (
    <form onSubmit={handleSubmit}>
              <div>
                <h3><label htmlFor="front">Front</label></h3>
                  <textarea
                      name="front" id="front" cols="30" rows="10"
                      onChange={handleChange}
                      value={front}>
                    </textarea>
              </div>
             
              <div>
                <h3><label htmlFor="back">Back</label></h3>
                  <textarea
                      name="back" id="back" cols="30" rows="10"
                      onChange={handleChange}
                      value={back}>
                    </textarea>
              </div>
              
              <button>Submit</button>
          </form>
  )
}

export default FlashcardForm