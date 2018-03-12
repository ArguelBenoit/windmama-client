import React from 'react';

function RightPanelInfo() {
  return <div className="child-container last">
    <h1>
      Visualization of wind data in real time.
    </h1>
    <p>
      Windmama shows in real time, the metar and connected anemometers, Pioupiou, FFVL and Holfuy.
    </p>
    <ul style={{paddingLeft: 0, listStyle: 'none'}}>
      <li>
        <a href="https://aviationweather.gov/" target="_blank" rel="noopener noreferrer">Metar</a>
      </li>
      <li>
        <a href="https://pioupiou.fr" target="_blank" rel="noopener noreferrer">Pioupiou</a>
      </li>
      <li>
        <a href="http://federation.ffvl.fr/" target="_blank" rel="noopener noreferrer">FFVL</a>
      </li>
      <li>
        <a href="https://holfuy.com/" target="_blank" rel="noopener noreferrer">Holfuy</a>
      </li>
    </ul>
    <a href="mailto:benoit.arguel@gmail.com">
      <button className="mail">
        contact me
        &nbsp;
        <i className="ion-paper-airplane" />
      </button>
    </a>
  </div>;
}

export default RightPanelInfo;
