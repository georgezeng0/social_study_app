import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { createFlashcard, updateForm, resetForm, editFlashcard, populateFlashcardForm } from '../features/flashcardSlice'
import TextEditor from './TextEditor'

const FlashcardForm = ({formType, editNotesOnly}) => {
    const dispatch = useDispatch()
    const { f_id } = useParams();
    const [searchParams, _] = useSearchParams();
    const s_id = searchParams.get("set")
  const { front, back, title, reversible, notes, stats: {difficulty} } = useSelector(state => state.flashcard[formType])
  

  useEffect(() => {
    if (formType === 'formEdit') {
      dispatch(populateFlashcardForm(f_id))
    }
  }, [formType,dispatch])

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

  if (editNotesOnly) {
return <form onSubmit={handleSubmit}>

      <div>
            <TextEditor name='notes' value={notes} formType={formType}/>
      </div>
              
      <button>Submit</button>
    </form>
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3><label htmlFor="front">Title</label></h3>
        <input type="text" name="title" value={title}
          onChange={handleChange}
          placeholder="Something to describe this flashcard" />
      </div>
      <h3>Options</h3>
      <div>
        <label htmlFor="difficulty">Difficulty</label>
        <input type="range" id="difficulty" name="difficulty"
          min="0" max="3" value={difficulty} onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="reversible">Reversible</label>
        <input type="checkbox" id="reversible" name="reversible"
         value={reversible} onChange={handleChange}
        />
      </div>
      <div>
        <h3><label htmlFor="front">Front</label></h3>
            <TextEditor name='front' value={front} formType={formType}/>
      </div>
      
      <div>
        <h3><label htmlFor="back">Back</label></h3>
            <TextEditor name='back' value={back} formType={formType}/>
      </div>

      <div>
        <h3><label htmlFor="notes">Notes</label></h3>
            <TextEditor name='notes' value={notes} formType={formType}/>
      </div>
              
      <button>Submit</button>
    </form>
  )
}

export default FlashcardForm