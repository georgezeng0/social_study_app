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
    timeLeft: -1,
    isStudy: true,
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

      <div>
        <button onClick={()=>setShowTimer(!showTimer)}>
          {timerSummary.timeLeft >= 0 ? timerSummary.isPaused? "Paused " : timerSummary.isStudy ? "Study " : "Break " : "Timer "} 
          {convertMiliSecsToClockString(timerSummary.timeLeft)}
          </button>
      </div>
      <StudyTimer props={{ setShowTimer,showTimer,setTimerSummary }} />
      
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