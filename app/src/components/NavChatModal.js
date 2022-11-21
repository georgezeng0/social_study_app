import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavChatModal = ({setShowMessages}) => {
  const { joinedRooms, newMessages } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  
  const shortenString = (s) => {
    if (!s) {
      return ""
    }
    if (s.length > 30) {
      return s.slice(0,25)+"..."
    } else {
      return s
    }
  }

  return (
      <Wrapper>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h4 className='m-0'>Chat Notifications</h4>
        <button className='btn-close' onClick={() => setShowMessages(false)}></button></div>
          {!user._id && <div>
            Log in to view
          </div>}

          {joinedRooms.map(
            room => {
              const { _id: c_id, title, messages } = room
              return <div key={c_id} className="room-row">
                <Link to={`/chatrooms/${c_id}`} className={`btn room-btn ${newMessages[c_id] && 'bg-warning'}`}>
                  <b>{title}</b> <span>({newMessages[c_id] || 0} New Messages)</span>
                  <div>
                    Last Message: <i id="author">{messages[messages.length - 1]?.author?.nickname}</i> - {shortenString(messages[messages.length - 1]?.body)}
                  </div>
                </Link>
                      
              </div>
            }
          )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
width: 100%;
padding: 20px;
border-radius: 20px;
background-color: var(--white);
box-shadow: 0 0 4px grey;
.room-row{
  padding: 2px;
  width: 100%;
}
.room-btn{
  width: 100%;
}
#author{
  
}
`

export default NavChatModal