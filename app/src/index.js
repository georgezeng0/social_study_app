import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import { Provider } from 'react-redux'
import store from './store'

import App from './App';

import 'bootstrap/dist/js/bootstrap.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>
);

