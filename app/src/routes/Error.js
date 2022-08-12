import React from 'react'

const Error = ({status=500,message="Undefined Error"}) => {
  return (
      <main>
          <h1>Error - {status}</h1>
          <h5>{message}</h5>
    </main>
  )
}

export default Error