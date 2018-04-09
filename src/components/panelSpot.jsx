import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getColor } from '../filters';
import { Actions } from '../store/actions.js';
import HeadingUnit from './headingUnit.jsx';
import WindUnit from './windUnit.jsx';
import store from '../store/store.js';
import { Link } from 'react-router-dom';

class PanelSpot extends Component {
  sumFunc(id) {
    if (window.location.pathname.split('/')[2] !== id)
      Actions.loadActivity(true);
    if (store.mobile)
      Actions.leftActivation();
  }
  render() {
    const { spot } = this.props;
    const { viewportWidth, place } = store;
    const { idInsteadLoc } = store.settings;
    let id;
    if (idInsteadLoc) {
      id = spot.id;
    } else if (!idInsteadLoc && place[spot.id][3] === '') {
      id = (place[spot.id][4] ? place[spot.id][4] + ' - ' : '' ) +
            place[spot.id][0] + ', ' +
            place[spot.id][1]; // countryCode (lat, lng)
    } else {
      id = place[spot.id][4] + ' - ' + place[spot.id][3]; // countryCode cityName
    }

    if (id && id.length >= 22 && viewportWidth >= 480)
      id = id.substring(0, 20) + '..';

    const spotProps = {
      className: 'child-panel button',
      style: {
        opacity: spot.connected
          ? 1
          : 0.4,
        padding: !store.settings.metarRaw
          ? '8px 0px'
          : '12px 0px'
      },
      onClick: () => this.sumFunc(spot.id),
      onMouseOver: () => Actions.hoverId(spot.id)
    };

    const styleChildContainer = {
      paddingBottom: !store.settings.metarRaw
        ? '0px'
        : '8px'
    };

    return <Link to={`/station/${spot.id}`} style={{color: '#e8e8e8'}}>
      <div {...spotProps} >
        <div className="container-city-info" style={styleChildContainer}>
          <span className="city">
            {id}
          </span>
          <div className="info">
            <div>
              <HeadingUnit heading={spot.heading} max={spot.avg} />
            </div>
            {spot.avg === '--'
              ? <span className="max">--</span>
              : <span className="max" style={{color: getColor(spot.avg)}}>
              <WindUnit value={spot.avg}/>
              {' ' + store.settings.windUnit}
            </span>
          }
          </div>
        </div>
        {spot.raw && store.settings.metarRaw
          ? <span className="rawdata">
              {spot.raw}
            </span>
          : ''
        }
      </div>
    </Link>;
  }
}

PanelSpot.propTypes = {
  spot: PropTypes.object
};

export default PanelSpot;
