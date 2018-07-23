import io from 'socket.io-client';
import { Actions } from './actions.js';
import request from 'request';

let init = {
    // apiUrl: `http://${window.location.hostname}:81/v2`,
    // socketUrl : `http://${window.location.hostname}:81/`,
    apiUrl: 'http://windmama.fr:81/v2',
    socketUrl : 'http://windmama.fr:81',
    windObservation: {},
    loading: true,
    mobile: false,
    hoverId: false,
    idUpdate: false,
    displayStation: false,
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

if(navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)) {
  init.mobile = true;
} else {
  init.mobile = false;
}

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
let urlWindObservation = `${init.apiUrl}/wind-observation${init.settings.onlyMetar ? '/by-name/metar' : ''}`;
request(urlWindObservation, (z, x, b) => {
  jsonParsePromise(b).then( value => {
    value.forEach(e => {
      if (e.items && e.items[0]) {
        let name = e.type + '.' + e.id;
        init.windObservation[name] = e;
        init.windObservation[name].name = name;
      }
    });
    Actions.DataReceived();
    Actions.loadActivity(false);
  }).catch( () => {
    Actions.loadActivity(false);
    alert('Hum... There is a problem connecting to the api of windmama.');
  });
});


const socket = io.connect(
  init.socketUrl,
  {secure: true}
);
socket.on('connect', () => {
  socket.emit('room', (init.settings.onlyMetar ? 'metar' : 'windObservation'));
});
socket.on('windObservationType', data => {
  data = JSON.parse(data);
  Actions.updateDetail(data);
});

export default init;
