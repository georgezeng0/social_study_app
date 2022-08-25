import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createSet,resetForm,updateForm,editSet, populateSetForm,resetSuccess } from '../features/setSlice'
//import { Error } from '../routes'
import AsyncModal from './AsyncModal'
//import Loading from './Loading'
import { useAuth0 } from '@auth0/auth0-react'
import getToken from '../utils/getToken'


const SetForm = ({ formType }) => {
  const {getAccessTokenSilently} = useAuth0()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { s_id } = useParams();
  const { [formType]: { name, tags, isPublic }, tagsList, error: { isError, message, status }, isLoading,
success: {isSuccess, successMessage}, selectedSet: {_id: createdSetID}
  } = useSelector(state => state.set)
  
  // Populate form if editing state
  useEffect(() => {
    if (formType === "formEdit") {
        dispatch(populateSetForm(s_id))
      }
  }, [dispatch, formType])
  
  // Navigate on successful submit
  useEffect(() => {
    if (isSuccess && formType === 'formNew') {
      setTimeout(() => {
        dispatch(resetSuccess())
        dispatch(resetForm({ formType }))
        navigate(`/sets/${createdSetID}`)
      }
    , 2000)
      
    }
    if (isSuccess && formType === 'formEdit') {
      setTimeout(() => {
        dispatch(resetSuccess())
        dispatch(resetForm({ formType }))
        navigate(`/sets/${s_id}`)
      }
        , 2000)
    }
  }, [isSuccess, formType])

  // Handle submit using token for API call
    const handleSubmit = async (e) => {
      e.preventDefault()
      const token = await getToken(getAccessTokenSilently)
        if (formType === 'formNew') {
            dispatch(createSet({token}))
        } 
        if (formType === 'formEdit') {
          dispatch(editSet({ s_id, token }))     
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateForm({formType,name, value}))
  }

  return (
    <>
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

      <button disabled={isSuccess || isLoading}>Submit</button>
      </form>
      
      <AsyncModal props={{ isError, status, message, isLoading, isSuccess, successMessage }} />
      </>
  )
}

export default SetForm