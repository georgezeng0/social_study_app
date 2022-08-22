// AuthWrapper
// handles auth0 isLoading and interaction with user model backend

import React,{ useEffect }  from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { getUser,clearUser } from '../features/userSlice'

function AuthWrapper({ children }) {
  const { isLoading, error, user, isAuthenticated } = useAuth0();
  const { user: reduxUser } = useSelector(state=>state.user)
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getUser(user.sub)) // sub contains the user id from auth0
      // If user authenticated, get the user info from app DB
    }
    if (!isLoading && !user && reduxUser._id) {
      dispatch(clearUser())
      // If no user in auth0 (logged out), then clear the Redux user store if there is one
    }
  },[user,isAuthenticated,reduxUser])



    if (isLoading) {
      return <Loading/>
    } 
    if (error) {
        return <>
            <h1>{error.message}</h1>
        </>
    }
    return <>
      {children}
    </>
  }

export default AuthWrapper