import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'


const Error = ({ status = 500, message = "Undefined Error" }) => {

  return (
    <main className='container text-center'>
      <RiErrorWarningLine style={{fontSize: "12rem", color: "orange"}} />
          <h1 className='display-3'>Error - {status}</h1>
          <h5>{message}</h5>
    </main>
  )
}

export default Error