import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../components'
import { getUserProfile,updateUserProfile } from '../features/userSlice'
import getToken from '../utils/getToken'

const Profile = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
    const { isLoading, authProfile } = useSelector(state => state.user)
    const [nicknameinput,setNickname]=useState('')
    
    useEffect(() => {
        if (isAuthenticated && user) {
            async function fetchUser() {
                const token = await getToken(getAccessTokenSilently)
                dispatch(getUserProfile({ u_id: user.sub, token }))
            }
            fetchUser()
        }
    }, [isAuthenticated, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = await getToken(getAccessTokenSilently)
        dispatch(updateUserProfile({u_id:user.sub, token, nickname: nicknameinput}))
    }

    if (isLoading) {
        return <Loading/>
    }

    const {name,nickname,email, picture} = authProfile

  return (
      <main>
          <img src={picture} alt="" />
          <h1>Name: {name}</h1>
          <h2>Nickname: {nickname}</h2>
          <h4>Email: {email}</h4>
          <form onSubmit={handleSubmit}>
              <input type="text" value={nicknameinput} onChange={e=>setNickname(e.target.value)} />
              <button>Change Nickname</button>
          </form>
    </main>
  )
}

export default Profile