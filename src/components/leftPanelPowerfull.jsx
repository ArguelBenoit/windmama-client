import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelSpot from './panelSpot.jsx';
import moment from 'moment';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';

class LeftPanelPowerfull extends Component {
  constructor(props) {
    super(props);
    this.initList = this.initList.bind(this);
    this.updateList = this.updateList.bind(this);
    this.state = {
      maxList: []
    };
  }
  componentDidMount() {
    store.on(typeOfActions.UPDATE_DETAIL, this.updateList);
    store.on(typeOfActions.DATA_RECEIVED, this.initList);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateList);
    store.removeListener(typeOfActions.DATA_RECEIVED, this.initList);
  }
  initList() {
    const { windObservation } = store;
    const allId = Object.keys(windObservation);
    let maxList = [];
    allId.forEach( name => {
      const detailName = windObservation[name].items[0];
      const infoName = windObservation[name];
      const diff = moment().valueOf() - moment(infoName.date).valueOf();
      let tempDetail = {
        name,
        type: infoName.type,
        id: infoName.id,
        heading: detailName.heading,
        avg: detailName.avg,
        connected: diff < 3600000 ? true : false,
        raw: detailName.raw ? detailName.raw : null
      };
      if (tempDetail.connected)
        maxList.push(tempDetail);
    });
    maxList.sort((a, b) => {
      if (a.avg < b.avg)
        return 1;
      else if (a.avg > b.avg)
        return -1;
      else
        return -1;
    });
    this.setState({
      maxList: maxList.slice(0, 8)
    });
  }
  updateList() {
    const { idUpdate, windObservation } = store;
    const { maxList } = this.state;
    const detailById = windObservation[idUpdate].items[0];
    maxList.forEach( el => {
      if (idUpdate === el.name) {
        this.initList();
      } else if (detailById.avg > el.avg) {
        this.initList();
      }
    });
  }
  render() {
    const { maxList } = this.state;
    var spots = maxList.map( spot => {
      return <PanelSpot spot={spot} key={spot.name} />;
    });
    return <div className="child-container last">
      <h1>
        <i className="ion-flash" />
        &nbsp;&nbsp;
        <span>
          Most windy stations
        </span>
      </h1>
      {spots}
    </div>;
  }
}

LeftPanelPowerfull.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanelPowerfull;
