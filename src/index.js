import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";

import Finder from './Finder.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

ReactDOM.render(<><main className="container">
  <h1 className="row">Rhyme Finder (SI579 PS06)</h1>
  <h3>Link to Repository: <a href="https://github.com/am1785/si_579_ps06">https://github.com/am1785/si_579_ps06</a></h3>
  <Finder />
  </main></>, document.getElementById('root'));