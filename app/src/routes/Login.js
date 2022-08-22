import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { loginWithRedirect, logout } = useAuth0();
    
    return (
        <main>
            <h1>Login</h1>
            <button onClick={()=>loginWithRedirect()}>Log In</button>
            <button onClick={()=>logout({returnTo:window.location.origin})}>Log Out</button>
    </main>
  )
}

export default Login