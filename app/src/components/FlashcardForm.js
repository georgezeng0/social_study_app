import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { createFlashcard, updateForm, resetForm, editFlashcard, populateFlashcardForm, resetSuccess } from '../features/flashcardSlice'
import TextEditor from './TextEditor'
import axios from 'axios'
import AsyncModal from './AsyncModal'
import { useAuth0 } from '@auth0/auth0-react'
import getToken from '../utils/getToken'

const FlashcardForm = ({ formType, editNotesOnly }) => {
  const {getAccessTokenSilently} = useAuth0()
  const dispatch = useDispatch()
  const navigate = useNavigate();
    const { f_id } = useParams();
    const [searchParams, _] = useSearchParams();
    const s_id = searchParams.get("set")
  const {
    [formType]: { front, back, title,parentSet, reversible, image: currentImage, notes, stats: { difficulty } },
    error: { isError, status, message }, isLoading,
    success: { isSuccess, successMessage },
    activeCard: { card: { _id: newCardId } }
  } = useSelector(state => state.flashcard)
  const [parentSet_,setParentSet_]=useState('')
  const [image, setImage] = useState('');

  // Populate form if in editing state
  useEffect(() => {
    if (formType === 'formEdit') {
      dispatch(populateFlashcardForm(f_id))
    }
  }, [formType, dispatch])

  useEffect(() => {
    if (parentSet) {
      setParentSet_(parentSet)
    }
  },[parentSet])

  // Navigate on successful submit
  useEffect(() => {
    if (isSuccess && successMessage==="Flashcard Created - Redirecting..." && formType === 'formNew') {
      setTimeout(() => {
        dispatch(resetForm({ formType }))
        dispatch(resetSuccess())
        if (newCardId) {
          navigate(`/flashcards/${newCardId}`)
        } else {
          navigate(`/sets/${s_id}`)
        }
      }
    , 2000)
      
    }
    if (isSuccess && successMessage==="Flashcard Updated - Redirecting..." && formType === 'formEdit') {
      setTimeout(() => {
        dispatch(resetForm({ formType }))
        dispatch(resetSuccess())
        if (window.history.state && window.history.state.idx > 0) {
          navigate(-1); // Go back if there is history
        } else {
          navigate(`/sets/${parentSet_}`, { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
        }
      }
        , 2000)
    }
  }, [isSuccess, formType])
  
  // Uses cloudinary upload API
  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`
  const imageUpload = async () => {
      const formData = new FormData();
      // Update formData object to send to cloudinary
      formData.append("file", image)
      formData.append("upload_preset",process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      formData.append("folder","food_delivery_app") // folder on cloudinary
      try {
          const res = await axios.post(url, formData,
              {
                  transformRequest: (data, headers) => {
                      headers["X-Requested-With"]="XMLHttpRequest"
                      delete headers['Authorization'];
                      return data;
                  }
            })
        dispatch(updateForm({ formType, name: "image", value: { url: res.data.url, publicID: res.data.public_id } }))
          return res.data.url
      } catch (error) {
          console.log(error);
      }
  }

  // Form Handling
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = await getToken(getAccessTokenSilently)
    if (formType === 'formNew') {
      if (image) {
        await imageUpload()
      }
      dispatch(createFlashcard({s_id, token}))
        } 
    if (formType === 'formEdit') {
      if (image) {
        await imageUpload()
      }
      dispatch(editFlashcard({ f_id, token }))
            dispatch(resetForm({ formType }))
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateForm({formType,name, value}))
  }

  // Return only the notes editor of the form
  if (editNotesOnly) {
    return <form onSubmit={handleSubmit}>

      <div>
            <TextEditor name='notes' value={notes} formType={formType}/>
      </div>
              
      <button>Submit</button>
    </form>
  }
  

  return (
    <>
      <Wrapper onSubmit={handleSubmit} className="card mt-2 text-center">
        <div className="card-body">
          <div className='mb-3'>
            <label htmlFor="front" className='h4 form-label'>Title</label>
            <input type="text" name="title" value={title}
              onChange={handleChange} className='form-control'
              placeholder="Something brief to describe this flashcard e.g. 'Image based question'" />
          </div>
          
          <div className='mb-3'>
            <h4>Options</h4>
            <div className="d-flex flex-column justify-content-center align-items-center">
            <label htmlFor="difficulty" className='form-label'>Difficulty (0-3)</label>
            <input type="range" id="difficulty" name="difficulty"
                min="0" max="3" value={difficulty} onChange={handleChange}
                className='form-control'
                style={{maxWidth:"400px"}}
            />
            <label htmlFor="reversible" className='form-label mt-2'>Reversibility</label>
            <input type="checkbox" id="reversible" name="reversible"
            value={reversible} onChange={handleChange}
              />
              <div className="form-text">During playthrough, the positions of the cards may be reversed.</div>
              </div>
          </div>

          <div>
            <h3>Image (Optional)</h3>
            
            {/* Image */}
            <div className='d-flex justify-content-center align-items-center border'>
                {image && <div className='preview-container'>
                    <span id='preview-text'>PREVIEW</span>
                    <img className="preview-img" src={URL.createObjectURL(image)} alt="" />
                    </div>
                }
              <label htmlFor="image">{formType === "formNew" ? `Select` : `Edit`} Image</label>
                
                <input type="file" accept="image/*" name="image" id="image"
                onChange={e => setImage(e.target.files[0])}
                className="border my-2"
                />
                
            </div>
            <div>
              <img src={currentImage?.url} alt="" width="200px" />
            </div>
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
          
      </div>
    </Wrapper>
    <AsyncModal props={{ isError, status, message, isLoading, isSuccess, successMessage }} />
    </>
  )
}

const Wrapper = styled.form`
#image{
    width: 75%;
    padding: 10px;
    border: 2px solid var(--secondary-2);
}
.preview-container{
    position: relative;
    width: 400px;
}
#preview-text{
    position: absolute;
    top: 40%;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    color: white;
    text-shadow: 0px 0px 5px black;
}
.preview-img{
    width: 400px;
    margin: 5px
}
`

export default FlashcardForm