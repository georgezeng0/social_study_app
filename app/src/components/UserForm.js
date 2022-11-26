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
      <form onSubmit={handleSubmit} className="pb-2 d-flex flex-column align-items-center text-center needs-validation">
          <h2 className='display-6'>Edit Details</h2>
          <div className='mb-2 w-100 d-flex flex-column align-items-center'>
              <label htmlFor="name" className="form-label h5">Name</label>
              <input name="name" id="name" type="text" value={name} onChange={handle_auth0Change}
              className="form-control text-center" style={{maxWidth:"400px"}} required
              />
          </div>
          <div className='mb-2 w-100 d-flex flex-column align-items-center'>
              <label htmlFor="nickname" className="form-label h5">Nickname</label>
              <input name="nickname" id="nickname" type="text" value={nickname} onChange={handle_auth0Change}
                  className="form-control text-center" style={{ maxWidth: "400px" }} required/>
          </div>
          <div className='mb-2 w-100 d-flex flex-column align-items-center'>
              <label htmlFor="email" className="form-label h5">Email</label>
              <input name="email" id="email" type="email" value={email} onChange={handle_auth0Change}
              className="form-control text-center" style={{maxWidth:"400px"}} required/>
          </div>
          <div className='mb-2'>
              <h3 className='display-6 mt-3'>Icon Colours</h3>
            <div className='mb-2'>
                <label htmlFor="color" className="form-label h5">Background Color</label>
                  <input name="color" id="color" type="color" value={color} onChange={handle_DBChange}
                  className="form-control" style={{maxWidth:"400px"}}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="textColor" className="form-label h5">Text Color</label>
                  <input name="textColor" id="textColor" type="color" value={textColor} onChange={handle_DBChange}
                  className="form-control" style={{maxWidth:"400px"}}/>
            </div>
          </div>
           
          <button disabled={isLoading||isAPILoading} className="btn btn-success">Save</button>
    </form>
  )
}

export default UserForm