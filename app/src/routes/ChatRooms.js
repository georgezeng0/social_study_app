import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRooms } from '../features/chatSlice'
import { Link } from 'react-router-dom'
import { ChatRoomForm,ChatSearch } from '../components'
import { useState } from 'react'

const ChatRooms = () => {
  const dispatch = useDispatch()
  const { filteredRooms: rooms } = useSelector(state => state.chat)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(getRooms())
  }, [])
  

  return (
    <main className='container'>
      <div className="border rounded-4">
        <ChatSearch />
        <hr />
        <div className="d-flex justify-content-center">
        <button className="btn btn-outline-dark mb-3" onClick={()=>{setShowForm(!showForm)}}>
          {showForm?"Close Form":"Create New Room"}
        </button>
        </div>
        <div className={`${showForm?"":"d-none"}`}>
        <ChatRoomForm/>
        </div>
      </div>
      
      <div className='row my-3'>
        {rooms.map(room => {
          return <article key={room._id} className="col-12 card p-2 bg-light text-center">
            <h3 className='card-title text-center'>{room.title}</h3>
            <div className="row">
              <div className="col"></div>
              <span className={`badge ${room.isPublic? "bg-dark":"bg-secondary"}  mb-2 col`} style={{maxWidth:"300px"}}>{room.isPublic? "Public": "Private"}</span>
              <div className="col"></div>
            </div>
            <Link to={`${room._id}`} className="btn btn-outline-dark">View</Link>
          </article>
        })}
      </div>
      
        </main>
  )
}

export default ChatRooms