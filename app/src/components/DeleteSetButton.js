import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteSet } from '../features/setSlice'
import getToken from '../utils/getToken'
import { useAuth0 } from '@auth0/auth0-react'

const DeleteSetButton = ({isLoading, s_id}) => {
    const dispatch = useDispatch()
    const {getAccessTokenSilently} = useAuth0()

  return (
      <button disabled={isLoading} onClick={async () => {
          const token = await getToken(getAccessTokenSilently)
          dispatch(deleteSet({ s_id, token }))
      }}>Delete</button>
  )
}

export default DeleteSetButton