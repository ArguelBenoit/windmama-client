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

console.log(init.settings.onlyMetar);
const socket = io.connect(
  init.settings.onlyMetar
    ? window.location.protocol + '//' + window.location.hostname + ':81'
    : window.location.protocol + '//' + window.location.hostname + ':81?type=metar',
  {secure: true}
);
const registerData = (chanel, callback) => {
  socket.on(chanel, (data) => { callback(data); });
};
registerData('sendPubsubData', (data) => {
  Actions.updateDetail(data);
});


let urlDetails = !init.settings.onlyMetar
  ? window.location.protocol + '//' + window.location.hostname + ':81/detail'
  : window.location.protocol + '//' + window.location.hostname + ':81/detail?type=metar';
function reqDetail() {
  request(urlDetails, (z, x, b) => {
    init.detail = JSON.parse(b);
    Actions.DataReceived();
    Actions.loadActivity(false);
  });
}

let urlLocations = !init.settings.onlyMetar
  ? window.location.protocol + '//' + window.location.hostname + ':81/location'
  : window.location.protocol + '//' + window.location.hostname + ':81/location?type=metar';
request(urlLocations, (z, x, a) => {
  a = JSON.parse(a);
  const ids = Object.keys(a);
  ids.forEach(e => {
    init.place[e] = JSON.parse(a[e]);
  });
  reqDetail();
});

export default init;
