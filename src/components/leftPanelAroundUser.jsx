import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelSpot from './panelSpot.jsx';
import moment from 'moment';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';

class LeftPanelAroundUser extends Component {
  constructor(props) {
    super(props);
    this.updateDetail = this.updateDetail.bind(this);
    this.dataReceived = this.dataReceived.bind(this);
    this.state = {
      lat1: false,
      lng1: false,
      list: [],
      listName: []
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition( position => {
      let lat1 = position.coords.latitude;
      let lng1 = position.coords.longitude;
      this.setState({ lat1, lng1 });
    });
    store.on(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.on(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.removeListener(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  dataReceived() {
    const { windObservation } = store;
    let { lat1, lng1 } = this.state;
    const allName = Object.keys(windObservation);
    let allDistancesTemp = [];
    let allDistances = [];
    let listName = [];
    if (lat1 && lng1) { // "if loc active"
      allName.forEach( e => {

        let lat2 = windObservation[e].lat;
        let lng2 = windObservation[e].lng;

        const toRadians = Number => {
          return Number * Math.PI / 180;
        };

        let R = 6371e3;
        let φ1 = toRadians(lat1);
        let φ2 = toRadians(lat2);
        let Δφ = toRadians(lat2-lat1);
        let Δλ = toRadians(lng2-lng1);
        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c;
        allDistancesTemp.push({ name: e, d });
      });
      allDistancesTemp.sort((a, b) => {
        if (a.d < b.d)
          return -1;
        else if (a.d > b.d)
          return 1;
        else
          return -1;
      });
      for (let i = 0; i < 6; i++) {
        const detailName = windObservation[allDistancesTemp[i].name].items[0];
        const infoName = windObservation[allDistancesTemp[i].name];
        const diff = moment().valueOf() - moment(infoName.date).valueOf();
        let obj = {
          id: infoName.id,
          type: infoName.type,
          name: infoName.name,
          heading: detailName.heading,
          avg: detailName.avg,
          connected: diff < 3600000 ? true : false,
          raw: detailName.raw ? detailName.raw : null
        };
        allDistances.push(obj);
        listName.push(obj.name);
      }
      allDistances.sort((a, b) => {
        if (a.avg < b.avg)
          return 1;
        else if (a.avg > b.avg)
          return -1;
        else
          return -1;
      });
      this.setState({ list: allDistances, listName });
    }
  }
  updateDetail() {
    const { listName, list } = this.state;
    const { windObservation, idUpdate } = store;
    if (listName.indexOf(idUpdate) > -1) {
      list.forEach( e => {
        const detailById = windObservation[e.name].items[0];
        const diff = moment().valueOf() - moment(detailById.date).valueOf();
        e.heading = detailById.heading;
        e.avg = detailById.avg;
        e.connected = diff < 3600000 ? true : false;
        e.raw = detailById.raw ? detailById.raw : false;
      });
      list.sort((a, b) => {
        if (a.avg < b.avg)
          return 1;
        else if (a.avg > b.avg)
          return -1;
        else
          return -1;
      });
      this.setState({ list });
    }
  }
  render() {
    const { list } = this.state;
    var spots = list.map( spot => {
      return <PanelSpot spot={spot} key={spot.id} />;
    });

    return <div className="child-container">
      <h1>
        <i className="ion-android-locate" />
        &nbsp;&nbsp;
        <span>
          Stations around you
        </span>
      </h1>
      { list.length !== 0 ? spots : '' }
      <p className="child-panel-info error" style={{ display: list.length !== 0 ? 'none' : 'inherit'}} >
        Enable geolocation !
      </p>
    </div>;
  }
}

LeftPanelAroundUser.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanelAroundUser;
