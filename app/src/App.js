import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {
  FlashcardEdit, FlashcardNew, Flashcards, SingleFlashcard,
  SetEdit, SetNew, SingleSet, Error, Login
} from './routes'

import { Navbar } from './components'

const App = () => {
  const [serverResponse, setServerResponse] = useState('No Response')

  const APItest = async () => {
    try {
      const res = await axios('/api')
      setServerResponse(res.data.message)
    } catch (error) {
      console.log(error);
      setServerResponse(error.response.data);
    }
  }

  useEffect(() => {
    APItest()
  },[])

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>{serverResponse}</h1>}/>
        <Route path="/flashcards" element={<Flashcards/>}/>
        <Route path="/flashcards/create" element={<FlashcardNew/>}/>
        <Route path="/flashcards/:f_id" element={<SingleFlashcard/>}/>
        <Route path="/flashcards/:f_id/edit" element={<FlashcardEdit />} />
        <Route path="/sets/create" element={<SetNew/>}/>
        <Route path="/sets/:s_id" element={<SingleSet/>}/>
        <Route path="/sets/:s_id/edit" element={<SetEdit/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<Error status="404" message="Page not found!" />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
