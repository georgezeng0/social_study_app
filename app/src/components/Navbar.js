import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  
  
  return (
      <nav className='d-flex'>
          <Link to="/">Home</Link>
          <Link to="/flashcards">Flashcards</Link>
      <Link to="/login">Login</Link>
      <div>
        {(!isLoading && isAuthenticated) && user.name}
        {(!isLoading && isAuthenticated) ?
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button> :
          <button onClick={()=>loginWithRedirect()}>Log In</button> }
      </div>
      <Link to="/profile">Profile</Link>
    </nav>
  )
}

export default Navbar