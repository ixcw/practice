import React from 'react';
// 18
// import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './TodoList';
import reportWebVitals from './reportWebVitals';

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
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
