import { useAuth0 } from '@auth0/auth0-react';
import React,{ useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { ChatBox } from '../components'
import { joinRoom,leaveRoom, getOneChatRoom } from '../features/chatSlice';
import getToken from '../utils/getToken';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0()
  const { chatRoom } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.user)
  const { c_id } = useParams()

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (chatRoom.users.findIndex(item=>item.user === user._id)>-1) {
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

  return (
      <main>
      <h1>Chat Room
        <button onClick={handleJoinLeave}> {isJoined ? "Leave" : "Join"}</button>
      </h1>
          <ChatBox/>
    </main>
  )
}

export default ChatRoom