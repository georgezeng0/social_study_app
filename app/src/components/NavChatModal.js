import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const NavChatModal = () => {
    const { joinedRooms, newMessages } = useSelector(state => state.chat)

  return (
      <div className='bg-light'>
          <h4>Your Rooms</h4>
          {joinedRooms.map(
              room => {
                  const { _id: c_id, title, messages } = room
                  return <div key={c_id}>
                      Room: {title} <Link to={`/chatrooms/${c_id}`}>Goto Room</Link>
                      <span>({newMessages[c_id] || 0} New Messages)</span>
                      <div>
                      {messages[messages.length-1]?.author?.nickname} - 
                        {messages[messages.length-1]?.body}
                        </div>
                  </div>
              }
          )}
    </div>
  )
}

export default NavChatModal