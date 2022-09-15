import { useAuth0 } from '@auth0/auth0-react'
import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { resetForm, updateForm, sendMessage } from '../features/chatSlice'
import getToken from '../utils/getToken'
import UserIcon from './UserIcon'

const ChatBox = () => {
    const { getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()
    const { inputForm: { message }, isLoading,
        chatRoom: {messages, users=[]}
    } = useSelector(state => state.chat)
    const { user: { u_id, nickname}} = useSelector(state => state.user)

    // Submits message
    const handleSubmit = async (e) => {
        e.preventDefault()
        // If not empty and logged in - send message
        if (message.trim() && u_id) {
            const token = await getToken(getAccessTokenSilently)
            dispatch(sendMessage({token}));
        }
    }

    // Handle form change
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateForm({name,value}))
    }

  return (
      <Wrapper className='d-flex'>
          <div>
            <div className="messages">
                  {messages.map(message => {
                      return <p key={message._id}>{message.author.nickname} - {message.body}</p>
                })}
            </div>
            <div className="chatInput">
                  <form onSubmit={handleSubmit}>
                      <input
                          type="text" placeholder='Write Message...'
                          name="message"
                          value={message}
                          onChange={handleChange} />
                      <button>Send</button>
                </form>
            </div>
          </div>
          
          <div className="chatBar">
              {users.map((user, i) => {
                  // Display user nickname if exists, otherwise name
                  return <p key={i}>
                      {user?.user?.nickname || user?.user?.name}
                      <UserIcon name={user.user?.name} height={"50px"} width={"50px"} color={user.user?.icon?.color} textColor={user.user?.icon?.textColor} />
                      {user?.socketID.length ? "Online" : "Offline"}
                  </p>
              })}
          </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
.messages{
    height: 500px;
    width: 500px;
    border: 1px solid black;
    overflow: scroll;
}
.chatInput{
    border: 1px solid blue;
    height: 50px;
    width: 500px;
}
.chatBar{
    height: 550px;
    width: 200px;
    border: 1px solid green;
    overflow: scroll;
}
`

export default ChatBox