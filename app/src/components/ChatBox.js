import { useAuth0 } from '@auth0/auth0-react'
import React,{ useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { resetForm, updateForm, sendMessage } from '../features/chatSlice'
import breakpoints from '../utils/breakpoints'
import getToken from '../utils/getToken'
import UserIcon from './UserIcon'

// Taken from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

const ChatBox = () => {
    const { getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()
    const { inputForm: { message }, isLoading,
        chatRoom: {messages, users=[]}
    } = useSelector(state => state.chat)
    const { user: { u_id, nickname } } = useSelector(state => state.user)

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
      <Wrapper className='row g-0 border border rounded border-2 p-1 bg-light'>
          <div className='col-12 col-md-8'>
              <div className="messages container p-3" >
                  <div className="messages-inner p-2 d-flex flex-column-reverse " style={{ overflowX: "hidden",overflowY:"scroll" }}>
                      {[].concat(messages).reverse().map(message => {
                          const bgColour = message.author.icon.color || "white"
                          const date = new Date(message.date)
                        return <div key={message._id}
                            className={`card h-auto mb-1 
                            ${message.author.u_id === u_id ? "ms-3" : "me-3"}
                            `}
                            style={{background:hexToRGB(bgColour,0.5)}}
                        >
                            <div className="card-body">
                                <div className='text-muted'
                                    style={{position:"absolute",top:"0",fontSize:"0.7rem"}}
                                >{date.toLocaleString('en-GB')}</div>
                                <p className="card-text">
                                <b>{message.author.nickname}</b> : {message.body}
                                </p>
                            </div>
                            
                        </div>
                    })}
                  </div>
                  
            </div>
          </div>
          
          <div className='col chat-wrapper'>
          <div className="chatBar m-2 border border-2 rounded border-dark 
          d-flex flex-column">
              <div style={{ overflowX: "hidden" , overflowY:"auto"}}>
              <h3 className='text-center bg-dark text-white mb-0 pb-2 pt-1'>Users</h3>
              {users.map((user, i) => {
                  // Display user nickname if exists, otherwise name
                  return <div key={i} className="row g-0 border-bottom">
                      <div className='col-auto'>
                       <UserIcon name={user.user?.name} height={"50px"} width={"50px"} color={user.user?.icon?.color} textColor={user.user?.icon?.textColor} />
                      </div>
                      <div className='d-flex flex-column col ms-auto text-center'>
                        <span className=''>{user?.user?.nickname || user?.user?.name}</span>
                        <span> {user?.socketID.length ? <b className='text-success'>Online</b> : <span className='text-muted'>Offline</span>}</span>
                      </div>
                  </div>
              })}
            </div>
          </div>
          </div>
          

          <div className="chatInput container col-12">
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
          
          <div className="chatBar chatBar-below" style={{ overflowX: "hidden" }}>
            <div style={{ overflowX: "hidden" , overflowY:"auto"}}>
                <h3 className='text-center bg-dark text-white mb-0 pb-2 pt-1'>Users</h3>
                {users.map((user, i) => {
                    // Display user nickname if exists, otherwise name
                    return <div key={i} className="row g-0 border-bottom">
                        <div className='col-auto'>
                        <UserIcon name={user.user?.name} height={"50px"} width={"50px"} color={user.user?.icon?.color} textColor={user.user?.icon?.textColor} />
                        </div>
                        <div className='d-flex flex-column col ms-auto text-center'>
                            <span className=''>{user?.user?.nickname || user?.user?.name}</span>
                            <span> {user?.socketID.length ? <b className='text-success'>Online</b> : <span className='text-muted'>Offline</span>}</span>
                        </div>
                    </div>
                })}
                </div>
              
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
    height: 600px;
}
.chatBar-below{
    display:none;
}
@media (max-width:${breakpoints.md}) {
    .chat-wrapper{
        display: none
    }
    .chatBar-below{
        height: 300px;
        display: block;
    }
}
`

export default ChatBox