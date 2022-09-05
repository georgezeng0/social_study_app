import { useAuth0 } from '@auth0/auth0-react'
import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRoom, getRooms, resetRoomForm, updateRoomForm } from '../features/chatSlice'
import getToken from '../utils/getToken'
import { Link } from 'react-router-dom'

const ChatRooms = () => {
  const dispatch = useDispatch()
  const { roomForm: { name }, rooms } = useSelector(state => state.chat)
  const {getAccessTokenSilently} = useAuth0()

  useEffect(() => {
    dispatch(getRooms())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = await getToken(getAccessTokenSilently)
    dispatch(createRoom({ token }))
    dispatch(resetRoomForm())
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(updateRoomForm({name,value}))
}

  return (
      <main>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Room Name'
          value={name} onChange={handleChange} name="name"
        />
        <button>New Room</button>
      </form>
      <div>
        {rooms.map(room => {
          return <p key={room._id}>
            <Link to={`${room._id}`}>{room.title}</Link>
          </p>
        })}
      </div>
        </main>
  )
}

export default ChatRooms