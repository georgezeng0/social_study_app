import { useAuth0 } from '@auth0/auth0-react'
import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { resetForm, updateForm, sendMessage } from '../features/chatSlice'
import breakpoints from '../utils/breakpoints'
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
      <Wrapper className='row g-0 border border rounded border-2 p-1 bg-dark'>
          <div className='col-12 col-md-8'>
              <div className="messages container p-3" >
                  <div className="messages-inner p-2" style={{ overflowX: "hidden",overflowY:"scroll" }}>
                    {messages.map(message => {
                        return <div key={message._id}
                            className="card mb-1"
                        >
                            <div className="card-body">
                                <p className="card-text">
                                <b>{message.author.nickname}</b> : {message.body}
                                </p>
                            </div>
                            
                        </div>
                    })}
                  </div>
                  
            </div>
            <div className="chatInput container">
                  <form onSubmit={handleSubmit} className="row">
                      <div className="col">
                        <textarea
                            placeholder='Write Message...'
                            name="message"
                            value={message}
                            onChange={handleChange}
                            className="h-100 form-control"
                        />
                      </div>
                    
                      <div className="col-auto d-flex align-items-center me-2">
                          <button className='btn btn-success'>Send</button>
                        </div>
                </form>
            </div>
          </div>
          
          <div className="chatBar col" style={{overflowX:"hidden"}}>
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
    height: 600px;
}
.messages-inner{
    overflow: scroll;
    height: 100%;
}
.chatInput{
    height: 100px;
}
.chatBar{
    height: 700px;
    overflow: scroll;
}
@media (max-width:${breakpoints.md}) {
    .chatBar{
        height: 300px
    }
}
`

export default ChatBox