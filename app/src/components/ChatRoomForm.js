import React,{ useEffect }  from 'react'
import { createRoom, resetRoomForm, updateRoomForm,populateRoomForm,editRoom } from '../features/chatSlice'
import getToken from '../utils/getToken'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'

const ChatRoomForm = ({isEdit}) => {
    const { roomForm: { name, isPublic } } = useSelector(state => state.chat)
    const {user:{_id:userMongoID}} = useSelector(state=>state.user)
    const { getAccessTokenSilently, loginWithRedirect } = useAuth0()
    const dispatch = useDispatch();
    const { c_id } = useParams()

    useEffect(() => {
        dispatch(resetRoomForm())
    }, [])
    
    useEffect(() => {
        if (isEdit) {
            dispatch(populateRoomForm(c_id))
        }
    }, [isEdit])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userMongoID) {
            loginWithRedirect()
        }
        const token = await getToken(getAccessTokenSilently)
        if (!isEdit) {
            dispatch(createRoom({ token }))
        } else {
            dispatch(editRoom({token,c_id}))
        }
        dispatch(resetRoomForm())
      }
    
      const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateRoomForm({name,value}))
    }

  return (
      <form onSubmit={handleSubmit} className="border py-3 px-4 rounded-pill row">
          <div className="col-6">
        <input type="text" placeholder='Room Name'
              value={name} onChange={handleChange} name="name"
              className='form-control'
              />
              </div>
          <label htmlFor="isPublic" className='col-form-label col-2 text-end'>Public?</label>
          <div className="col-1 d-flex align-items-center">
          <input type="checkbox" id="isPublic" name="isPublic" checked={isPublic} onChange={handleChange} className="form-check-input"/>
          </div>
          
          <button className='col-auto ms-auto btn btn-dark btn-sm'>{isEdit ? "Edit Room" : "New Room"}</button>
      </form>
  )
}

export default ChatRoomForm