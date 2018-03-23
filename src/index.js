import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store.js';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
  <BrowserRouter>
    <App data={store} />
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
