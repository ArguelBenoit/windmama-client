import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelSpot from './panelSpot.jsx';
import moment from 'moment';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';

class LeftPanelBookmarks extends Component {
  constructor(props) {
    super(props);
    this.initList = this.initList.bind(this);
    this.updateSensor = this.updateSensor.bind(this);
    this.state = {
      spots: []
    };
  }
  componentDidMount() {
   store.on(typeOfActions.DATA_RECEIVED, this.initList);
   store.on(typeOfActions.UPDATE_DETAIL, this.updateSensor);
   store.on(typeOfActions.ADD_BOOKMARK, this.initList);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.DATA_RECEIVED, this.initList);
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateSensor);
    store.removeListener(typeOfActions.ADD_BOOKMARK, this.initList);
  }
  updateSensor() {
    let { bookmarks, idUpdate } = store;
    if ( bookmarks.indexOf(idUpdate) > -1 )
      this.initList();
  }
  initList() {
    let { bookmarks } = store;
    this.setState({ spots : [] });
    const { windObservation } = store;
    let spots = [];
    bookmarks.forEach( el => {
      if (windObservation[el]) {
        const detailName = windObservation[el];
        const diff = moment().valueOf() - moment(detailName.date).valueOf();
        const spot = {
          name: el,
          type: detailName.type,
          id: detailName.id,
          heading: detailName.items[0].heading,
          avg: detailName.items[0].avg,
          connected: diff < 3600000 ? true : false,
          raw: detailName.items[0].raw ? detailName.items[0].raw : null
        };
        spots.push(spot);
      }
    });
    spots.sort((a, b) => {
      if (a.avg < b.avg)
        return 1;
      else if (a.avg > b.avg)
        return -1;
      else
        return -1;
    });
    this.setState({ spots });
  }
  render() {
    const { spots } = this.state;
    if (spots.length > 0) {
      return <div className="child-container">
        <h1>
          <i className="fas fa-heart" />
          &nbsp;&nbsp;
          <span>
            Favorites places
          </span>
        </h1>
        {spots.map( spot => {
          return <PanelSpot spot={spot} key={spot.id} />;
        })}
      </div>;
    } else {
      return '';
    }
  }
}

LeftPanelBookmarks.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanelBookmarks;
