import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, updateForm } from '../features/userSlice'
import getToken from '../utils/getToken'

const UserForm = () => {
    const { getAccessTokenSilently } = useAuth0()
    const { isLoading,isAPILoading, form:{name,picture,email,nickname,password} } = useSelector(state => state.user)
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = await getToken(getAccessTokenSilently)
        dispatch(updateUserProfile({token}))
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateForm({name,value}))
    }
  return (
      <form onSubmit={handleSubmit}>
          <div>
              <label htmlFor="name">Name</label>
              <input name="name" id="name" type="text" value={name} onChange={handleChange} />
          </div>
          <div>
              <label htmlFor="nickname">Nickname</label>
              <input name="nickname" id="nickname" type="text" value={nickname} onChange={handleChange} />
          </div>
          <div>
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" value={email} onChange={handleChange} />
          </div>
          {/* <div>
              <label htmlFor="password">New Password</label>
              <input name="password" id="password" type="password" value={password} onChange={handleChange} />
          </div> */}
          <div>
              <label htmlFor="picture">Picture</label>
              <input name="picture" id="picture" type="text" value={picture} onChange={handleChange} />
          </div>
          <button disabled={isLoading||isAPILoading}>Submit</button>
    </form>
  )
}

export default UserForm