import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRooms } from '../features/chatSlice'
import { Link } from 'react-router-dom'
import { ChatRoomForm } from '../components'

const ChatRooms = () => {
  const dispatch = useDispatch()
  const { rooms } = useSelector(state => state.chat)


  useEffect(() => {
    dispatch(getRooms())
  }, [])
  

  return (
      <main>
      <ChatRoomForm/>
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