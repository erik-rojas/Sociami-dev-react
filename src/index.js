require('es6-object-assign').polyfill();
require('es6-promise').polyfill();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CookiesProvider } from 'react-cookie';

import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <CookiesProvider>
        <App RouteProps />
      </CookiesProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
