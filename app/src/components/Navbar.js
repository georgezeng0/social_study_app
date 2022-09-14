import React,{ useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import NavChatModal from './NavChatModal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const { newMessages } = useSelector(state=>state.chat)
  
  const [showMessages, setShowMessages] = useState(false)

  let messageTotal = Object.values(newMessages).reduce((total,count)=>(total+count),0)
  
  return (
      <Wrapper className='d-flex'>
          <Link to="/">Home</Link>
          <Link to="/flashcards">Flashcards</Link>
          <Link to="/chatrooms">Chatrooms</Link>
      <div>
        {(!isLoading && isAuthenticated) && user.name}
        {(!isLoading && isAuthenticated) ?
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button> :
          <button onClick={()=>loginWithRedirect()}>Log In</button> }
      </div>
      <Link to="/profile">Profile</Link>
      <div>
        <button onClick={()=>setShowMessages(!showMessages)}>
          Messages ({messageTotal || 0})
          </button>
      </div>
      <div className='NavChatModal-Wrapper'>
        {showMessages && <NavChatModal />}
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
.NavChatModal-Wrapper{
  width: 400px;
  height: 500px;
  position: absolute;
  top: 35px; // TBD adjust depending on nav height
  left: 50%; // TBD adjust responsively
}
`

export default Navbar