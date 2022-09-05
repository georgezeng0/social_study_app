import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { resetForm, updateForm, sendMessage, updateMessages, addUser,updateUsers } from '../features/chatSlice'

const ChatBox = () => {
    const dispatch = useDispatch()
    const { inputForm: { message }, isLoading, socket,
        chatRoom: {messages, users}
    } = useSelector(state => state.chat)
    const { user: { u_id, nickname}} = useSelector(state => state.user)

    // Listen for new messages from server
    useEffect(() => {
        socket.on('messageResponse', (data) => {
            dispatch(updateMessages(data))
        })
        socket.on('newUserResponse', (data) => {
            dispatch(updateUsers(data))
        })
        return () => {
            socket.off('messageResponse')
            socket.off('newUserResponse')
        }
    }, [])
    
    // Adds User to list of online users
    useEffect(() => {
        if (nickname) {
            dispatch(addUser(nickname))
        }
    },[nickname])

    // Submits message
    const handleSubmit = (e) => {
        e.preventDefault()
        // If not empty and logged in - send message
        if (message.trim() && u_id) {
            dispatch(sendMessage(nickname));
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
                      return <p>{message.name} - {message.message}</p>
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
              {users.map(user => {
                  return <p>{user.name}</p>
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
}
`

export default ChatBox