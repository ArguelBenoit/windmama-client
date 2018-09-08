import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getColor } from '../filters';
import { Actions } from '../store/actions.js';
import HeadingUnit from './headingUnit.jsx';
import WindUnit from './windUnit.jsx';
import store from '../store/store.js';
import { Link } from 'react-router-dom';

class PanelSpot extends Component {
  constructor(props) {
    super(props);
    this.subString = this.subString.bind(this);
  }
  componentDidMount() {
    this.subString();
  }
  componentDidUpdate() {
    this.subString();
  }
  subString() {
    if (this.city.getBoundingClientRect().width > (this.container.getBoundingClientRect().width - this.info.getBoundingClientRect().width - 20)) {
      while (this.city.getBoundingClientRect().width > (this.container.getBoundingClientRect().width - this.info.getBoundingClientRect().width - 20)) {
        this.city.textContent = this.city.textContent.substring(0, this.city.textContent.length -1);
      }
      this.city.textContent += '...';
    }
  }
  sumFunc(spotName, pathname) {
    let type = pathname.split('/')[2];
    let id = pathname.split('/')[3];
    let name = `${type}.${id}`;
    Actions.loadActivity(true);
    if (name === spotName)
      Actions.loadActivity(false);
    if (store.mobile)
      Actions.leftActivation();
  }
  render() {
    const { spot } = this.props;
    const { windObservation } = store;
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
      onClick: () => this.sumFunc(spot.name, window.location.pathname),
      onMouseOver: () => Actions.hoverId(spot.name)
    };
    return <Link to={`/station/${spot.type}/${spot.id}`} style={{color: '#e8e8e8'}}>
      <div {...spotProps} ref={container => this.container = container}>
        <div className="container-city-info">
          <span className="city" ref={city => this.city = city}>
            {name}
          </span>
          <div className="info" ref={info => this.info = info}>
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
