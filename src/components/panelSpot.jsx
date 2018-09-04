import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getColor } from '../filters';
import { Actions } from '../store/actions.js';
import HeadingUnit from './headingUnit.jsx';
import WindUnit from './windUnit.jsx';
import store from '../store/store.js';
import { Link } from 'react-router-dom';

class PanelSpot extends Component {
  sumFunc(spotName) {
    let type = window.location.pathname.split('/')[2];
    let id = window.location.pathname.split('/')[3];
    let name = `${type}.${id}`;

    if (name !== spotName) {
      Actions.loadActivity(true);
    } if (store.mobile) {
      Actions.leftActivation();
    }
  }
  render() {
    const { spot } = this.props;
    const { viewportWidth, windObservation } = store;
    const { idInsteadLoc } = store.settings;
    let name;
    if (idInsteadLoc) {
      name = spot.type + ' ' + spot.id;
    } else if (windObservation[spot.name].address2 !== '') {
      name =  (windObservation[spot.name].address3 !== '' ? windObservation[spot.name].address3 + ' - ' : '') +
               windObservation[spot.name].address2;
    } else {
      name = windObservation[spot.name].address3 + ' - ' + windObservation[spot.name].lng + '  ' + windObservation[spot.name].lat ;
    }

    if (name && name.length >= 22 && viewportWidth >= 480)
      name = name.substring(0, 20) + '..';

    const spotProps = {
      className: 'child-panel button',
      style: {
        opacity: spot.connected
          ? 1
          : 0.4,
        padding: !store.settings.metarRaw
          ? '8px 0px'
          : '8px 0px'
      },
      onClick: () => this.sumFunc(spot.name),
      onMouseOver: () => Actions.hoverId(spot.name)
    };

    return <Link to={`/station/${spot.type}/${spot.id}`} style={{color: '#e8e8e8'}}>
      <div {...spotProps} >
        <div className="container-city-info">
          <span className="city">
            {name}
          </span>
          <div className="info">
            <div>
              <HeadingUnit heading={spot.heading} max={spot.avg} />
            </div>
            {spot.avg == null
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
