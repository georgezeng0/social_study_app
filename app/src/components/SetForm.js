import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createSet,resetForm,updateForm,editSet } from '../features/setSlice'


const SetForm = ({formType}) => {
    const dispatch = useDispatch()
    const { s_id } = useParams();
    const {name} = useSelector(state=>state.set[formType])

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

              <button>Submit</button>
          </form>
  )
}

export default SetForm