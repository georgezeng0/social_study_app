import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';

import {
  FlashcardEdit, FlashcardNew, Flashcards, SingleFlashcard,
  SetEdit, SetNew, SingleSet, Error, Login, AuthWrapper, PrivateRoute,
  Landing, Profile, ChatRoom, ChatRooms
} from './routes'
import { Navbar } from './components'

// Auth0 provider with RedirectCallback as per example below
// https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
// Requires useNavigate hook thus needs to be wihtin BrowserRouter component
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
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        scope="user"
    >
    <AuthWrapper>
      <Navbar/>
      <Routes>
            <Route
              path="/"
              element={<Landing/>} 
              />
            <Route
              path="/flashcards"
              element={<Flashcards/>} 
              />
            <Route
              path="/flashcards/create"
              element={<PrivateRoute component={FlashcardNew} />} 
              />
            <Route
              path="/flashcards/:f_id"
              element={<SingleFlashcard/>} 
              />
            <Route
              path="/flashcards/:f_id/edit"
              element={<PrivateRoute component={FlashcardEdit} />} 
              />
            <Route
              path="/sets/create"
              element={<PrivateRoute component={SetNew} />}
            />
            <Route
              path="/sets/:s_id"
              element={<SingleSet/>}
            />
            <Route
              path="/sets/:s_id/edit"
              element={<PrivateRoute component={SetEdit} />}
            />
            {/* <Route
              path="/login"
              element={<Login/>}
            /> */}
            <Route
              path="/profile"
              element={<PrivateRoute component={Profile} />}
            />
            <Route
              path="/chatrooms"
              element={<ChatRooms/>}
            />
            <Route
              path="/chatrooms/testroom"
              element={<PrivateRoute component={ChatRoom} />}
            />
            <Route
              path="*"
              element={<Error status="404" message="Page not found!" />}
            />
        </Routes>
        </AuthWrapper>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
      
  )
}

export default App
