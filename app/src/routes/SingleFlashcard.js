import React from 'react'
import { useParams } from 'react-router-dom'
import { Flashcard } from '../components'

const SingleFlashcard = () => {
  const { f_id } = useParams()

  return (
    <main>
      <h1>Single Flashcard</h1>
      <div>
        <Flashcard f_id={f_id} />
      </div>
    </main>
  )
}

export default SingleFlashcard