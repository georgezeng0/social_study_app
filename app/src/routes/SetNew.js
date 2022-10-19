import React from 'react'
import { SetForm } from '../components'

const SetNew = () => {
  return (
      <main className='container'>
      <h1 className='display-1 text-center'>New Flashcard Set</h1>
      <hr />
          <div>
              <SetForm formType='formNew'/>
          </div>
    </main>
  )
}

export default SetNew