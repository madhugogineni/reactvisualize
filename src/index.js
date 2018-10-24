import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import App1 from './App1';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App1 />, document.getElementById('root'));

serviceWorker.unregister();
