import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, updateForm,updateDBForm, updateDBUser,populateDBForm } from '../features/userSlice'
import getToken from '../utils/getToken'

const UserForm = () => {
    const { getAccessTokenSilently } = useAuth0()
    const { isLoading, isAPILoading, user: { u_id }, auth0Form:{name,email,nickname}, databaseForm: {color, textColor, favSets} } = useSelector(state => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(populateDBForm())       
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = await getToken(getAccessTokenSilently)
        dispatch(updateUserProfile({ token }))
        dispatch(updateDBUser({token,u_id}))
    }

    const handle_auth0Change = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateForm({name,value}))
    }

    const handle_DBChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateDBForm({name,value}))
    }

  return (
      <form onSubmit={handleSubmit}>
          <div>
              <label htmlFor="name">Name</label>
              <input name="name" id="name" type="text" value={name} onChange={handle_auth0Change} />
          </div>
          <div>
              <label htmlFor="nickname">Nickname</label>
              <input name="nickname" id="nickname" type="text" value={nickname} onChange={handle_auth0Change} />
          </div>
          <div>
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" value={email} onChange={handle_auth0Change} />
          </div>
          {/* <div>
              <label htmlFor="password">New Password</label>
              <input name="password" id="password" type="password" value={password} onChange={handleChange} />
          </div> */}
          {/* <div>
              <label htmlFor="picture">Picture</label>
              <input name="picture" id="picture" type="text" value={picture} onChange={handleChange} />
          </div> */}
           <div>
              <label htmlFor="color">Background Color</label>
              <input name="color" id="color" type="color" value={color} onChange={handle_DBChange} />
          </div>
          <div>
              <label htmlFor="textColor">Text Color</label>
              <input name="textColor" id="textColor" type="color" value={textColor} onChange={handle_DBChange} />
          </div>
          <button disabled={isLoading||isAPILoading}>Submit</button>
    </form>
  )
}

export default UserForm