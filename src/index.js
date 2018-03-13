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


// only phonegap
if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
  var app = {
    initialize: function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
      this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');
      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');
      console.log('Received Event: ' + id);
    }
  };
  app.initialize();
}
