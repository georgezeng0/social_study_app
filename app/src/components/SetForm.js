import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createSet,resetForm,updateForm,editSet, populateSetForm } from '../features/setSlice'


const SetForm = ({formType}) => {
    const dispatch = useDispatch()
    const { s_id } = useParams();
  const { [formType]: { name, tags, isPublic }, tagsList } = useSelector(state => state.set)
  
  useEffect(() => {
    if (formType === "formEdit") {
        dispatch(populateSetForm(s_id))
      }
    }, [dispatch, formType])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formType === 'formNew') {
            dispatch(createSet())
            dispatch(resetForm({ formType }))
        } 
        if (formType === 'formEdit') {
            dispatch(editSet(s_id))
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
        <h3><label htmlFor="name">Set Name</label></h3>
        <input type="text" name="name" id="name" onChange={handleChange} value={name} />
      </div>

      <fieldset>
        <legend>Tags:</legend>
        {tagsList.map((tag, i) => {
          return <div key={i}>
            <label htmlFor={tag}>{tag}</label>
            <input type="checkbox" id={tag} name="tags" value={tag}
              checked={tags.indexOf(tag) > -1}
            onChange={handleChange}
            />
            </div>
          })}
      </fieldset>

      <br />

      <div>
          <label htmlFor="isPublic">Public Set?</label>
        <input type="checkbox" name="isPublic" id="isPublic" onChange={handleChange} checked={isPublic} />
      </div>

      <button>Submit</button>
    </form>
  )
}

export default SetForm