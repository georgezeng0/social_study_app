import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavSet } from '../features/userSlice';
import getToken from '../utils/getToken';
import {AiFillHeart,AiOutlineHeart} from 'react-icons/ai'
import styled from 'styled-components';

const ToggleFavouriteSetButton = ({ s_id, isLoading }) => {
    const dispatch = useDispatch();
    const { user: {favSets}, isButtonLoading } = useSelector(state => state.user)
    const { getAccessTokenSilently } = useAuth0()

    const handleClick = async () => {
        if (isLoading || isButtonLoading) {
            return
        }
        const token = await getToken(getAccessTokenSilently)
        dispatch(toggleFavSet({ s_id, token }))
    }

    return (
      <button className='btn btn-outline p-1' onClick={handleClick}>
      <AiFillHeart 
          style={{ color: favSets.indexOf(s_id) > -1 ? "red" : "grey", fontSize: "1.5rem" }}
      >
          Toggle Favourite
            </AiFillHeart>
            </button>
  )
}

const Wrapper = styled.div`

`

export default ToggleFavouriteSetButton