import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import { Provider } from 'react-redux'
import { Auth0Provider } from "@auth0/auth0-react";
import store from './store'

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-y-3g49-u.us.auth0.com"
    clientId="SV8Pkp3FCN990lN9ila2c4sU8zTOBcuA"
    redirectUri={window.location.origin}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

