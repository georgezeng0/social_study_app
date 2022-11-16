import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, UserForm, UserIcon } from '../components'
import { getUserProfile,resetPasswordEmail, resetSuccess } from '../features/userSlice'
import getToken from '../utils/getToken'

const Profile = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
    const { isLoading, authProfile, isAPILoading,
        success: { resetPasswordSuccess },
        databaseForm: {color, textColor}} = useSelector(state => state.user)
    
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

    const {name,nickname,email} = authProfile

  return (
      <main className='container'>
          <div className="card mb-5">
              <div className="card-img-top d-flex justify-content-center" style={{background:color}}>
              <UserIcon name={name} color={color} textColor={textColor} />
              </div>
              <div className="list-group list-group-flush text-center">
                  <li className="list-group-item py-3">
                      <h2 className='mb-0'><span className="text-muted">Name:</span> {name}</h2>
                  </li>
                  <li className="list-group-item">
                      <h2><span className="text-muted">Nickname:</span> {nickname}</h2>
                      <p className='form-text mb-0'>This is your name in chat rooms.</p>
                  </li>
                  <li className="list-group-item py-3">
                      <h2 className='mb-0'><span className="text-muted">Email:</span> {email}</h2>
                  </li>
                  <li className="list-group-item py-3">
                      {/* If login is via username/password - then show button to send reset password email */}
                        {(authProfile.identities && authProfile.identities[0].provider === "auth0")?
                            resetPasswordSuccess ?
                            <div>
                                We've just sent you an email to reset your password.
                            </div>
                            :
                            <div>
                                Reset/Change password: &nbsp;
                                  <button onClick={() => dispatch(resetPasswordEmail(authProfile.email))}
                                      className="btn btn-secondary"
                                  >Send Email</button>
                                </div>
                            :
                            <div>
                                You are using a social login method and cannot change your password.
                            </div>
                            }
                  </li>
                  <li className="list-group-item">
                    <UserForm />
                  </li>
              </div>            
            </div>
    </main>
  )
}

export default Profile