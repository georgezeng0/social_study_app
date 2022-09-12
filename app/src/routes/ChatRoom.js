import { useAuth0 } from '@auth0/auth0-react';
import React,{ useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { ChatBox, ChatRoomForm } from '../components'
import { joinRoom,leaveRoom, getOneChatRoom,toggleShowEdit, deleteRoom } from '../features/chatSlice';
import getToken from '../utils/getToken';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0()
  const { chatRoom,showEdit } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  const { c_id } = useParams()

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (chatRoom.users.findIndex(item=>item.user?._id === user?._id)>-1) {
      setIsJoined(true)
    } else {
      setIsJoined(false)
    }
  }, [chatRoom, c_id])

  const fetchChatRoom = async () => {
    const token = await getToken(getAccessTokenSilently)
    dispatch(getOneChatRoom({c_id,token}))
  }

  useEffect(() => {
    if (chatRoom._id !== c_id) {
      fetchChatRoom()
    }
  },[c_id])

  const handleJoinLeave = async () => {
    const token = await getToken(getAccessTokenSilently)
    if (isJoined) {
      dispatch(leaveRoom({ token, c_id }))
    } else {
      dispatch(joinRoom({ token, c_id }))
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
        <button onClick={handleJoinLeave}> {isJoined ? "Leave" : "Join"}</button>
      </h1>
      {showEdit && <ChatRoomForm isEdit/>}
      <div>
        <button onClick={()=>dispatch(toggleShowEdit())}>Edit</button>
        <button onClick={handleDeleteButton}>Delete</button>
      </div>
          <ChatBox/>
    </main>
  )
}

export default ChatRoom