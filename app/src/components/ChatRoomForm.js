import React,{ useEffect }  from 'react'
import { createRoom, resetRoomForm, updateRoomForm,populateRoomForm,editRoom } from '../features/chatSlice'
import getToken from '../utils/getToken'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'

const ChatRoomForm = ({isEdit}) => {
    const { roomForm: { name,isPublic } } = useSelector(state => state.chat)
    const { getAccessTokenSilently } = useAuth0()
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
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Room Name'
          value={name} onChange={handleChange} name="name"
          />
          <label htmlFor="isPublic">Public?</label>
          <input type="checkbox" id="isPublic" name="isPublic" checked={isPublic} onChange={handleChange} />
          <button>{isEdit ? "Edit Room" : "Create Room"}</button>
      </form>
  )
}

export default ChatRoomForm