import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, UserForm } from '../components'
import { getUserProfile } from '../features/userSlice'
import getToken from '../utils/getToken'

const Profile = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
    const { isLoading, authProfile, isAPILoading } = useSelector(state => state.user)
    
    useEffect(() => {
        if (isAuthenticated && user) {
            async function fetchUser() {
                const token = await getToken(getAccessTokenSilently)
                dispatch(getUserProfile({ u_id: user.sub, token }))
            }
            fetchUser()
        }
    }, [isAuthenticated, dispatch])

    if (isLoading || isAPILoading) {
        return <Loading/>
    }

    const {name,nickname,email, picture} = authProfile

  return (
      <main>
          <img src={picture} alt="" />
          <h1>Name: {name}</h1>
          <h2>Nickname: {nickname}</h2>
          <h4>Email: {email}</h4>
          <UserForm />
    </main>
  )
}

export default Profile