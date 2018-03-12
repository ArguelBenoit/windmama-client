import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Actions } from '../store/actions.js';
import FollowButton from './followButton.jsx';
import InfoDate from './infoDate.jsx';
import store from '../store/store.js';

class InfoWidget extends Component {
  render() {
    const { place } = this.props;
    const { displayDetail } = store;

    let link;
    if (displayDetail.split('.')[0] === 'pioupiou')
    link = <a href={'https://pioupiou.fr/fr/' + displayDetail.split('.')[1]} target="_blank">Station {displayDetail}</a>;
      else if (displayDetail.split('.')[0] === 'ffvl')
      link = <a href={'http://www.balisemeteo.com/balise.php?idBalise=' + displayDetail.split('.')[1]} target="_blank">Station {displayDetail}</a>;
        else if (displayDetail.split('.')[0] === 'holfuy')
        link = <a href={'http://holfuy.com/fr/data/' + displayDetail.split('.')[1]} target="_blank">Station {displayDetail}</a>;
          else if (displayDetail.split('.')[0] === 'metar')
          link = <a href={'http://aviationweather.cp.ncep.noaa.gov/metar/site?id=' + displayDetail.split('.')[1] + '&db=metar'} target="_blank">Station {displayDetail}</a>;

            return <div className="info-widget">
              <div className="buttons-container">
                <FollowButton id={displayDetail} />
                <button className="button close" onClick={() => Actions.displayDetail(false)}><i className="fas fa-times" /></button>
              </div>
              <div className="location-time-info">
                {(place[4] ? place[4] + ' ' : '') + (place[2] ? place[2] + ' ' : '') + (place[3] ? place[3] : '')}{` / ${place[0]}, ${place[1]} `}
                {link}
              </div>
              <InfoDate id={displayDetail}/>
              {displayDetail.split('.')[0] === 'metar'
                && store.settings.metarRaw
                ? <div className="metar-info">
                {JSON.parse(store.detail[displayDetail][0]).raw}
              </div>
              : '' // nothing
            }
          </div>;
  }
};

InfoWidget.propTypes = {
  place: PropTypes.any,
  displayDetail: PropTypes.any
};

export default InfoWidget;
