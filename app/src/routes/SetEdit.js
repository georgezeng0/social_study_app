import React from 'react'
import { SetForm } from '../components'

const SetEdit = () => {
  return (
      <main className='container'>
      <h1 className='text-center display-1'>Edit Set</h1>
      <hr/>
          <div>
              <SetForm formType='formEdit'/>
          </div>
    </main>
  )
}

export default SetEdit