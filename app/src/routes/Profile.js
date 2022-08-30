import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, UserForm } from '../components'
import { getUserProfile,resetPasswordEmail, resetSuccess } from '../features/userSlice'
import getToken from '../utils/getToken'

const Profile = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
    const { isLoading, authProfile, isAPILoading, success: {resetPasswordSuccess} } = useSelector(state => state.user)
    
    useEffect(() => {
        dispatch(resetSuccess())
    },[])

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
          {/* If login is via username/password - then show button to send reset password email */}
          {(authProfile.identities && authProfile.identities[0].provider === "auth0")?
              resetPasswordSuccess ?
              <div>
                  We've just sent you an email to reset your password.
              </div>
              :
              <div>
                  Reset/Change password via email:
                  <button onClick={()=>dispatch(resetPasswordEmail(authProfile.email))}>Reset Password</button>
                  </div>
              :
              <div>
                  You are using a social login method and cannot change your password.
              </div>
          }
          <UserForm />
    </main>
  )
}

export default Profile