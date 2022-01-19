/* Passer à true lors de developpement sur l'api en dev */
/* Pour le developpement du client seulement, privilégier une connexion à l'api de la production */
const connectToDevApi = false;
/* En developpement ciblé la source */
/* En production la source est induite par le sous domaine */
/* valeur possible => all ffvl pioupiou holfuy */
const source = 'all';


let config = {
  apiUrl: 'https://api.windmama.fr/v2',
  socketUrl: 'https://api.windmama.fr/',
  source
};


if (connectToDevApi) {
  config = {
    apiUrl: 'http://localhost:81/v2',
    socketUrl : 'http://localhost:81/',
    source
  };
}


const firstHostname = window.location.hostname.split('.')[0];
if (firstHostname === 'www' || firstHostname === 'windmama') {
  config.source = 'all';
} else if (firstHostname === 'ffvl') {
  config.source = 'ffvl';
} else if (firstHostname === 'holfuy') {
  config.source = 'holfuy';
} else if (firstHostname === 'pioupiou') {
  config.source = 'pioupiou';
}


export default config;
