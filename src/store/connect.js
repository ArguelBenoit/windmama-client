import io from 'socket.io-client';
import { Actions } from './actions.js';
import request from 'request';

let init = {
    apiUrl: 'https://api.windmama.fr/v2',
    socketUrl : 'https://api.windmama.fr/',
    windObservation: {},
    loading: true,
    mobile: null,
    hoverId: null,
    idUpdate: null,
    displayStation: null,
    scrollGraphObservation: 0,
    bookmarks: localStorage.bookmarks
      ? localStorage.bookmarks.split(',')
      : [],
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    location: {
      latitude: null,
      longitude: null
    },
    settings: localStorage.settings
      ? JSON.parse(localStorage.getItem('settings'))
      : {
          idInsteadLoc: false,
          onlyMetar: false,
          metarRaw: false,
          universalTime: null, // local / utc
          windUnit: 'kts', // 'km/h', 'kts', 'm/s'
          headingUnit: 'arrow', // 'arrow', 'abbrev', 'degrees'
          tempUnit: 'C', // 'C', 'F'
          rainUnit: 'picto' // 'picto', 'precip'
        }
};

// detect if user use a mobile or a laptop
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


// detect location user
navigator.geolocation.getCurrentPosition( position => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  init.location.latitude = position.coords.latitude;
  init.location.longitude = position.coords.longitude;
  Actions.locationDetected({
    latitude,
    longitude
  });
}, () => {
  console.log(
    '%cHey you ! Your geolocation is disabled. If you want to enjoy great functionality you have to activate it. ♥ ♥ ♥',
      'background: black;' +
      'font-size: 12px;' +
      'color: pink;' +
      'padding: 7px;' +
      'border: 5px solid pink;'
    );
});
// --
// example for component :
// navigator.geolocation.getCurrentPosition( position => {
//   console.log(position);
// }, err => {
//   console.log(err);
// });


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
  socket.emit('room', (init.settings.onlyMetar ? 'metar' : 'windObservation/pioupiou'));
});
socket.on('windObservationType', data => {
  data = JSON.parse(data);
  Actions.updateDetail(data);
});

export default init;
