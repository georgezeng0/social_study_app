import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';

import {
  FlashcardEdit, FlashcardNew, Flashcards, SingleFlashcard,
  SetEdit, SetNew, SingleSet, Error, Login, AuthWrapper, PrivateRoute,
  Landing
} from './routes'

import { Navbar } from './components'

// RedirectCallback as per example
// https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

const App = () => {
  
  return (
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
    domain="dev-y-3g49-u.us.auth0.com"
    clientId="SV8Pkp3FCN990lN9ila2c4sU8zTOBcuA"
    redirectUri={window.location.origin}
    >
    <AuthWrapper>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/flashcards" element={<Flashcards/>}/>
        <Route path="/flashcards/create" element={<FlashcardNew/>}/>
        <Route path="/flashcards/:f_id" element={<SingleFlashcard/>}/>
        <Route path="/flashcards/:f_id/edit" element={<FlashcardEdit />} />
            <Route path="/sets/create" element={
              <PrivateRoute component={SetNew}/>} />
        <Route path="/sets/:s_id" element={<SingleSet/>}/>
        <Route path="/sets/:s_id/edit" element={<SetEdit/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<Error status="404" message="Page not found!" />}/>
        </Routes>
        </AuthWrapper>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
      
  )
}

export default App
