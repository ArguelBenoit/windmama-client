import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowButton from './followButton.jsx';
import InfoDate from './infoDate.jsx';
import store from '../../store/store.js';
import { Link } from 'react-router-dom';

class InfoWidget extends Component {
  render() {
    const { detail, displayDetail } = this.props;
    let url;
    let lastDate = detail.items[detail.items.length - 1].date;

    if (detail.type === 'pioupiou')
      url = `https://pioupiou.fr/fr/${detail.id}`;
    else if (detail.type === 'ffvl')
      url = `http://www.balisemeteo.com/balise.php?idBalise=${detail.id}`;
    else if (detail.type === 'holfuy')
      url = `http://holfuy.com/fr/data/${detail.id}`;
    else if (detail.type === 'metar')
      url = `http://aviationweather.cp.ncep.noaa.gov/metar/site?id=${detail.id}&db=metar`;

    return <div className="info-widget">
      <div className="buttons-container">
        <FollowButton id={displayDetail} />
        <Link to="/">
          <button className="button close"><i className="fas fa-times" /></button>
        </Link>
      </div>
      <div className="location-time-info">
        {detail.address3} {detail.address1} {detail.address2}
        <br />
        <a href={url} target="_blank">Station {detail.type} {detail.id}</a>
      </div>
      <InfoDate date={lastDate} name={displayDetail}/>
      {displayDetail.split('.')[0] === 'metar' && store.settings.metarRaw
        ? <div className="metar-info">
            <span>--</span>
            <br/>
            <span style={{color: 'red', fontWeight: 'bold'}}>METAR {detail.items[0].raw}</span>
          </div>
        : ''
      }
    </div>;
  }
}

InfoWidget.propTypes = {
  place: PropTypes.any,
  detail: PropTypes.any,
  displayDetail: PropTypes.string
};

export default InfoWidget;
