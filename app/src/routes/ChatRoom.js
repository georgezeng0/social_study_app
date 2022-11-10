import { useAuth0 } from '@auth0/auth0-react';
import React,{ useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { ChatBox, ChatRoomForm, FlashcardRoomWindow, Loading, VideoPlayer } from '../components'
import {
  joinRoom, leaveRoom, getOneChatRoom, toggleShowEdit,
  deleteRoom, resetMessageCount, syncUserSockets
} from '../features/chatSlice';
import getToken from '../utils/getToken';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0()
  const { chatRoom, showEdit, newMessages, roomLoading } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  const { c_id } = useParams()

  const [isJoined, setIsJoined] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [showViewer,setShowViewer] = useState(false)

  useEffect(() => {
    if (chatRoom.users.findIndex(item => item.user?._id === user?._id) > -1) {
      setIsJoined(true)
    } else {
      setIsJoined(false)
    }
  }, [chatRoom, c_id])

  useEffect(() => {
    if (newMessages[c_id]) {
      dispatch(resetMessageCount(c_id))
    }
  }, [dispatch, newMessages, c_id])

  const fetchChatRoom = async () => {
    const token = await getToken(getAccessTokenSilently)
    dispatch(getOneChatRoom({ c_id, token }))
  }

  useEffect(() => {
    if (chatRoom._id !== c_id) {
      fetchChatRoom()
    }
    if (chatRoom.users.length > 0) {
      // Check if database information on user sockets corresponds to actual socket room
      // If user doesnt trigger "on disconnect" event socket, they may still appear online e.g. if server shuts down/ crashes
      // This is highly likely if using Heroku eco tier due to sleep after inactivity
      dispatch(syncUserSockets({c_id}))
    }
  }, [c_id])

  const handleJoinLeave = async () => {
    const token = await getToken(getAccessTokenSilently)
    if (isJoined) {
      dispatch(leaveRoom({ token, c_id }))
    } else {
      dispatch(joinRoom({ token, c_id, passcode }))
    }
  }

  const handleDeleteButton = async () => {
    const token = await getToken(getAccessTokenSilently)
    dispatch(deleteRoom({ c_id, token }))
    navigate('/chatrooms')
  }

  if (roomLoading) {
    return <Loading/>
  }

  return (
    <main className='container'>
      <h1 className='text-center display-1'>{chatRoom.title}
      <span className="badge bg-primary fs-5 align-middle ms-4">{chatRoom.isPublic?"Public":"Private"}</span>
      </h1>
      
      {!chatRoom.isPublic && isJoined && 
        <h4 className='text-center rounded-pill border bg-dark text-white py-2'>
        Passcode to join - {chatRoom.passcode}
        </h4>
      }

      {
        chatRoom.owner === user._id &&
        <div>
          <h5 className='text-center'>You are the owner</h5>
          <div className='row my-3'>
            <div className="col"></div>
            <button onClick={() => dispatch(toggleShowEdit())} className="col-2 btn btn-primary">Edit</button>
            <button onClick={handleDeleteButton} className="col-2 btn btn-danger">Delete</button>
            <div className="col"></div>
          </div>
        </div>
      }

      {showEdit && <ChatRoomForm isEdit />}

      <div className='row my-3'>
        <div className="col"></div>
        {!chatRoom.isPublic && !isJoined && chatRoom.owner !== user._id &&
          <div className="col-3">
            <input className='form-control'
            type="text" id="passcode" placeholder="Passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
          </div>
        }
          <button onClick={handleJoinLeave} className='btn btn-dark col-2'> {isJoined ? "Leave" : "Join"}</button>
        <div className="col"></div>

        {!chatRoom.isPublic &&
          <div className="form-text text-center w-100">A passcode can be provided by the owner or a member</div>
        }

        </div>

      

      <div className='border rounded p-3 mb-3 '>
        <div className="d-flex justify-content-between align-items-center py-2 px-1">
          <div className="h4">Flashcard Viewer</div>
          <button className="btn btn-secondary" onClick={()=>setShowViewer(!showViewer)}>Show/Hide</button>
        </div>
        <div className={`p-2 ${showViewer?"":"d-none"}`} style={{ height: "500px",overflowX:"hidden",overflowY:"auto"}}>
          <FlashcardRoomWindow/>
        </div>
      </div>

      <div className='mb-3'>
        <ChatBox />
        </div>

      <div className='mb-3'>
        <VideoPlayer />
        </div>
      
    </main>
  )
}

export default ChatRoom