import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import actionsReducer from './store/reducers/actions';
import scopesReducer from './store/reducers/scopes';
import dotenv from 'dotenv';
dotenv.config();

const composeEnhancers =
  (process.env.NODE_ENV !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  actions: actionsReducer,
  scopes: scopesReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
