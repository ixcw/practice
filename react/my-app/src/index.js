import React from 'react';
// 18
// import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './index.css';
import TodoListRR from './TodoListRR';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';

const App = (
  <Provider store={store}>
    <TodoListRR />
  </Provider>
)

// 18
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// 16
const root = document.getElementById('root');
ReactDOM.render(
  <React>
    <App />
  </React>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
