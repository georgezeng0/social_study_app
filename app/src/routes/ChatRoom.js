import { useAuth0 } from '@auth0/auth0-react';
import React,{ useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { ChatBox, ChatRoomForm, StudyTimer, VideoPlayer } from '../components'
import { joinRoom,leaveRoom, getOneChatRoom,toggleShowEdit, deleteRoom, resetMessageCount } from '../features/chatSlice';
import getToken from '../utils/getToken';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0()
  const { chatRoom, showEdit, newMessages } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  const { c_id } = useParams()

  const [isJoined, setIsJoined] = useState(false)
  const [passcode, setPasscode] = useState('')

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

  return (
    <main>
      <h1>{chatRoom.title}
      </h1>
      {!chatRoom.isPublic && isJoined && 
        < h4 >
        Passcode for new members - {chatRoom.passcode}
      </h4>
      }
      {
        chatRoom.owner===user._id &&
        <h5>You are the owner</h5>
      }
      <div>
        {!chatRoom.isPublic && !isJoined && chatRoom.owner!==user._id &&
          <input type="text" id="passcode" placeholder="Passcode" value={passcode} onChange={(e)=>setPasscode(e.target.value)} />
        }
      <button onClick={handleJoinLeave}> {isJoined ? "Leave" : "Join"}</button>
      </div>
      {showEdit && <ChatRoomForm isEdit/>}
      <div>
        <button onClick={()=>dispatch(toggleShowEdit())}>Edit</button>
        <button onClick={handleDeleteButton}>Delete</button>
      </div>
      <ChatBox />
      <VideoPlayer />
      <StudyTimer />
    </main>
  )
}

export default ChatRoom