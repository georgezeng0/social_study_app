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
  }, [dispatch, formType, s_id])
  
  // Navigate on successful submit
  useEffect(() => {
    if (isSuccess && successMessage==="Set Created - Redirecting..." && formType === 'formNew') {
      setTimeout(() => {
        dispatch(resetSuccess())
        dispatch(resetForm({ formType }))
        navigate(`/sets/${createdSetID}`)
      }
    , 2000)
      
    }
    if (isSuccess && successMessage==="Set Updated - Redirecting..." && formType === 'formEdit') {
      setTimeout(() => {
        dispatch(resetSuccess())
        dispatch(resetForm({ formType }))
        navigate(`/sets/${s_id}`)
      }
        , 2000)
    }
  }, [isSuccess,successMessage, formType, s_id, dispatch, navigate, createdSetID])

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
      <div className="row">
        <div className="col-xxl-2"></div>
      <form onSubmit={handleSubmit} className="col needs-validation">
        
        <div className='mb-3'>
          <label htmlFor="name" className='form-label h4 d-block text-center'>Set Name</label>
            <input type="text" name="name" id="name" onChange={handleChange} value={name}
            className='form-control' required
            />
          </div>
  
          <div className='d-flex flex-column align-items-center'>
            <label htmlFor="isPublic" className='h4'>Make Public</label>
            <div className='form-check form-switch'>
            <input type="checkbox" name="isPublic" id="isPublic" onChange={handleChange} checked={isPublic}
              className='form-check-input me-2'
              /> 
            </div>
         </div>
  
          <fieldset className='container px-2 py-2 mt-3 card bg-light' required>
            <h4 className='text-center form-label'>Tags</h4>
        <div className='row px-2 py-1'>
          {tagsList.map((tag, i) => {
            return <div key={i} className="col-3 col-md-2 form-check">
              <label htmlFor={tag} className="" style={{fontSize:"0.8rem"}}>{tag}</label>
              <input type="checkbox" id={tag} name="tags" value={tag}
                  checked={tags.indexOf(tag) > -1}
                    onChange={handleChange}
                className="form-check-input"
              />
              </div>            
          })}
                  </div>
          </fieldset>
          
          {formType === "formNew" ?
            <p className='text-center form-text mt-2'>
              You will be the owner of the new Flashcard set which will initially be empty. Name, privacy and tags all can be changed after creation.
            </p> :
            <br />
          }
  
          <div className='d-flex justify-content-center'>
            <button disabled={isSuccess || isLoading} className="btn btn-dark btn-lg">Submit</button>
            </div>
        </form>

        <div className="col-xxl-2"></div>
      </div>
      
      
      <AsyncModal props={{ isError, status, message, isLoading, isSuccess, successMessage }} />
      </>
  )
}

export default SetForm