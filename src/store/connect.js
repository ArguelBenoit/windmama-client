import io from 'socket.io-client';
import { Actions } from './actions.js';
import request from 'request';

let init = {
    detail: {},
    place: {},
    loading: true,
    mobile: false,
    hoverId: false,
    idUpdate: false,
    bookmarks: localStorage.bookmarks
      ? localStorage.bookmarks.split(',')
      : [],
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    settings: localStorage.settings
      ? JSON.parse(localStorage.getItem('settings'))
      : {
          idInsteadLoc: false,
          onlyMetar: false,
          metarRaw: false,
          universalTime: false, // local / utc
          windUnit: 'kt', // 'km/h', 'kt', 'm/s'
          headingUnit: 'arrow', // 'arrow', 'abbrev', 'degrees'
          tempUnit: 'C', // 'C', 'F'
          rainUnit: 'picto' // 'picto', 'precip'
        }
};

(()=>{
  if(navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i))
    init.mobile = true;
  else
    init.mobile = false;
})();


const socket= io.connect(
  window.location.protocol + '//' + window.location.hostname + ':81',
  {secure: true}
);
socket.on('connect', () => {
  socket.emit('room', (init.settings.onlyMetar ? 'metar' : 'observation'));
});
socket.on('observationType', data => {
  Actions.updateDetail(data);
});



const jsonParsePromise = json => {
  return new Promise((resolve, reject) => {
    try {
      let obj = JSON.parse(json);
      resolve(obj);
    } catch(err) {
      reject(err);
    }
  });
};

let urlDetails = window.location.protocol + '//' + window.location.hostname + ':81/detail/' + (init.settings.onlyMetar ? '?type=metar' : '');
function reqDetail() {
  request(urlDetails, (z, x, b) => {
    jsonParsePromise(b).then( value => {
      init.detail = value;
      Actions.DataReceived();
      Actions.loadActivity(false);
    }).catch( () => {
      Actions.loadActivity(false);
      alert('Hum... There is a problem connecting to the Windmama API');
    });
  });
}

let urlLocations = window.location.protocol + '//' + window.location.hostname + ':81/location' + (init.settings.onlyMetar ? '?type=metar' : '');
request(urlLocations, (z, x, a) => {
  jsonParsePromise(a).then( value => {
    init.place = value;
    reqDetail();
  }).catch( () => {
    Actions.loadActivity(false);
    alert('Hum... There is a problem connecting to the Windmama API');
  });
});

export default init;
