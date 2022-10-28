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
      <main className='container'>
      <ChatRoomForm/>
      <div className='row my-3'>
        {rooms.map(room => {
          return <p key={room._id} className="col-12 card p-2 bg-light">
            <h3 className='card-title text-center'>{room.title}</h3>
            <span className="badge bg-secondary mb-2">{room.isPublic? "Public": "Private"}</span>
            <Link to={`${room._id}`} className="btn btn-outline-dark">View</Link>
          </p>
        })}
      </div>
      
        </main>
  )
}

export default ChatRooms