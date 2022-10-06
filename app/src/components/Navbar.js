import React,{ useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import NavChatModal from './NavChatModal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import StudyTimer from './StudyTimer';
import { useEffect } from 'react';

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

  // Intersection Observer for navbar
  const navRef = useRef(null)
  const navbarHeightRef = useRef(null)
  const [intersectionRatio, setIntersectionRatio] = useState(1)

  const observerCallback = (entries, observer) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      setIntersectionRatio(entry.intersectionRatio);
    } else {
      setIntersectionRatio(0);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback,
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0]
      })
    if (navRef.current) {
      observer.observe(navRef.current)
    }
    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current)
      }
    }
  },[navRef])
  
  return (<>
    <div ref={navRef} className="position-absolute" style={{height:navbarHeightRef.current?navbarHeightRef.current.clientHeight:0, width:"100%"}}></div>
    <Wrapper className='navbar navbar-expand-md sticky-top navbar-light' ref={navbarHeightRef}>
      <NavDiv className="container" id="nav-container-custom" intersectionRatio={intersectionRatio}>
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

            <li className="nav-item">
            {(!isLoading && isAuthenticated) && user.name}
            </li>
            
            <li className='nav-item'>
          {(!isLoading && isAuthenticated) ?
            <button className='btn btn-link nav-link' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button> :
            <button className='btn btn-link nav-link' onClick={()=>loginWithRedirect()}>Log In</button> }
        </li>
          
        </ul>
      </div>
          
      <div className={`NavChatModal-Wrapper ${showMessages?'':'d-none'}`}>
        {showMessages && <NavChatModal />}
      </div>

        <StudyTimer props={{ setShowTimer, showTimer, setTimerSummary }} />

        
        
      </NavDiv>
    </Wrapper>
    
    </>)
}

const Wrapper = styled.nav`
  /* background-color: white; */
.NavChatModal-Wrapper{
  width: 400px;
  height: 500px;
  position: absolute;
  top: 35px; // TBD adjust depending on nav height
  left: 50%; // TBD adjust responsively
}
`
const NavDiv = styled.div`
  background-color: rgba(255,255,255,${props=> props.intersectionRatio>0.5?0:1});
  /* border: 2px solid var(--grey-3); */
  border-radius: 20px;
  transition: background-color 0.3s;
  box-shadow: 0px 0px ${props=> props.intersectionRatio>0.5?0:"5px"} grey;
`

export default Navbar