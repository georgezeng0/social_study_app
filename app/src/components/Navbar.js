import React,{ useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import NavChatModal from './NavChatModal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import StudyTimer from './StudyTimer';
import { useEffect } from 'react';
import { IoTimerOutline } from 'react-icons/io5'
import { AiOutlineMessage, AiFillMessage } from 'react-icons/ai'
import breakpoints from '../utils/breakpoints'


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
  const [messageTotal, setMessageTotal] = useState(0)
  
  useEffect(() => {
    console.log(Object.values(newMessages));
    if (Object.values(newMessages).length === 0 || Object.values(newMessages)[0] === undefined) {
      console.log(newMessages)
      setMessageTotal(0)
    } else {
      console.log(123,newMessages)
      setMessageTotal(Object.values(newMessages).reduce((total, count) => (total + count), 0))
    }
    }, [newMessages])
  
  const convertMiliSecsToClockString = (number) => {
    let minutes = String(parseInt(number / 1000 / 60))
    let seconds = String(parseInt((number / 1000) % 60))
    if (minutes.length === 1) {
      minutes = "0" + minutes
    }
    if (seconds.length === 1) {
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
  },[])
  
  return (<>
    <div ref={navRef} className="position-absolute" style={{height:navbarHeightRef.current?navbarHeightRef.current.clientHeight:0, width:"100%"}}></div>
    <Wrapper className='navbar navbar-expand-md sticky-top navbar-light' ref={navbarHeightRef}>
      <NavDiv className="container" id="nav-container-custom" intersectionRatio={intersectionRatio}>
      <Link to="/" className='navbar-brand text-dark'>RoteMate</Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
             <Link to="/flashcards" className='nav-link'>Flashcards</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/chatrooms" className='nav-link'>Rooms</Link>
          </li>

          <li className="nav-item">
              <MessagesButton onClick={() => setShowMessages(!showMessages)}
                className='nav-link btn btn-link shadow-none'>
                {messageTotal === 0 ? <AiOutlineMessage style={{position: "relative",bottom:"1px"}} /> : <AiFillMessage style={{ position: "relative",color: "red",bottom:"1px" }} />}
            </MessagesButton>
          </li>

          <li className='nav-item'>
            <button className='btn btn-link nav-link shadow-none align-top' onClick={()=>setShowTimer(!showTimer)}>
                {timerSummary.timeLeft !== 0 && timerSummary.repeat !== 0 ?
                  timerSummary.isPaused ? "P " : timerSummary.isStudy ? "S "
                    : "B " : <span className='align-top d-inline position-relative' style={{bottom:"1px"}}><IoTimerOutline /> </span>} 
              {convertMiliSecsToClockString(timerSummary.timeLeft)}
              </button>
            </li>

            {(!isLoading && isAuthenticated) && <li className="nav-item">
            <Link to="/profile" className='nav-link'>{user.name}</Link>
          </li>}
            
            <li className='nav-item'>
              {(!isLoading && isAuthenticated) ?
              <button className='btn btn-link nav-link shadow-none' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button> :
              <button className='btn btn-link nav-link shadow-none' onClick={()=>loginWithRedirect()}>Log In</button> }
            </li>
          
        </ul>
      </div>
          
        <StudyTimer props={{ setShowTimer, showTimer, setTimerSummary }} />

        <div className={`NavChatModal-Wrapper container ${showMessages?'':'d-none'}`}>
          {showMessages && <NavChatModal setShowMessages={setShowMessages} />}
      </div>
        
      </NavDiv>

      
    </Wrapper>
    
    </>)
}

const Wrapper = styled.nav`
  /* background-color: white; */
.NavChatModal-Wrapper{
  width: 500px;
  height: auto;
  position: absolute;
  top: 65px;
  right: 0px;
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    right: 0px;
    padding: 0 20px;
  }
}
#nav-container-custom{
  @media (max-width: ${breakpoints.lg}) {
    transition: none;
  }
  transition: max-width 0.2s;
}
`
const NavDiv = styled.div`
  background-color: rgba(255,255,255,${props=> props.intersectionRatio>1.0?0:1});
  /* border: 2px solid var(--grey-3); */
  border-radius: 20px;
  box-shadow: 0px 0px ${props => props.intersectionRatio > 0.5 ? 0 : "5px"} grey;
  position: relative;
`

const MessagesButton = styled.button`
  span{
    position: relative;
    right: 17px;
    font-size: 1rem;
  }
`

export default Navbar