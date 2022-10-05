import React,{ useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import NavChatModal from './NavChatModal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import StudyTimer from './StudyTimer';

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const { newMessages } = useSelector(state => state.chat)
  
  const [showMessages, setShowMessages] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [timerSummary, setTimerSummary] = useState({
    isPaused: true,
    timeLeft: 0,
    isStudy: true,
    repeat: 0
  })

  let messageTotal = Object.values(newMessages).reduce((total, count) => (total + count), 0)
  
  const convertMiliSecsToClockString = (number) => {
    let minutes = String(parseInt(number / 1000 / 60))
    let seconds = String(parseInt((number / 1000) % 60))
    if (minutes.length == 1) {
      minutes = "0" + minutes
    }
    if (seconds.length == 1) {
      seconds = "0" + seconds
    }
    return `${minutes}:${seconds}`
  }
  
  return (
    <Wrapper className='navbar navbar-expand-md sticky-top'>
      <div className="container">
      <Link to="/" className='navbar-brand'>RoteMate</Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto">

          <li className="nav-item">
             <Link to="/flashcards" className='nav-link'>Flashcards</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/chatrooms" className='nav-link'>Chatrooms</Link>
          </li>
          
          <li className='nav-item'>
          {(!isLoading && isAuthenticated) && user.name}
          {(!isLoading && isAuthenticated) ?
            <button className='btn btn-link nav-link' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button> :
            <button className='btn btn-link nav-link' onClick={()=>loginWithRedirect()}>Log In</button> }
          </li>

          <li className="nav-item">
            <Link to="/profile" className='nav-link'>Profile</Link>
          </li>

          <li className="nav-item">
              <button onClick={()=>setShowMessages(!showMessages)} className='nav-link btn btn-link'>
              Messages ({messageTotal || 0})
            </button>
          </li>

          <li className='nav-item'>
            <button className='btn btn-link nav-link' onClick={()=>setShowTimer(!showTimer)}>
              {timerSummary.timeLeft === 0 && timerSummary.repeat!==0? timerSummary.isPaused? "Paused " : timerSummary.isStudy ? "Study " : "Break " : "Timer "} 
              {convertMiliSecsToClockString(timerSummary.timeLeft)}
              </button>
          </li>
          
        </ul>
      </div>
          
      <div className={`NavChatModal-Wrapper ${showMessages?'':'d-none'}`}>
        {showMessages && <NavChatModal />}
      </div>

      <StudyTimer props={{ setShowTimer,showTimer,setTimerSummary }} />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
background-color: white;
.NavChatModal-Wrapper{
  width: 400px;
  height: 500px;
  position: absolute;
  top: 35px; // TBD adjust depending on nav height
  left: 50%; // TBD adjust responsively
}
a{
  :hover{
    cursor: pointer !important
  }
}

`

export default Navbar