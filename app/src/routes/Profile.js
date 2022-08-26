import { useAuth0 } from '@auth0/auth0-react'
import React,{ useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../components'
import { getUserProfile } from '../features/userSlice'
import getToken from '../utils/getToken'

const Profile = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
    const { isLoading, authProfile } = useSelector(state=>state.user)
    
    useEffect(() => {
        if (isAuthenticated && user) {
            async function fetchUser() {
                const token = await getToken(getAccessTokenSilently)
                dispatch(getUserProfile({ u_id: user.sub, token }))
            }
            fetchUser()
        }
    }, [isAuthenticated, dispatch])

    if (isLoading) {
        return <Loading/>
    }

    const {name,nickname,email, picture} = authProfile

  return (
      <main>
          <img src={picture} alt="" />
          <h1>{name}</h1>
          <h2>{email}</h2>
    </main>
  )
}

export default Profile