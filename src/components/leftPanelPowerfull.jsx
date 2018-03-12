import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelSpot from './panelSpot.jsx';
import _ from 'lodash';
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
    const { place, detail } = store;
    const allId = _.intersection(Object.keys(detail), Object.keys(place));
    let maxList = [];
    allId.forEach( id => {
      const detailById = JSON.parse(detail[id][0]);
      const diff = moment().valueOf() - moment(detailById.date).valueOf();
      let tempDetail = {
        id,
        heading: detailById.heading,
        avg: detailById.avg === '--' ? 0 : detailById.avg,
        connected: diff < 3600000 ? true : false,
        raw: detailById.raw ? detailById.raw : false
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
    const { idUpdate, detail } = store;
    const { maxList } = this.state;
    const detailById = JSON.parse(detail[idUpdate][0]);
    maxList.forEach( el => {
      if (idUpdate === el.id) {
        this.initList();
      } else if (detailById.avg > el.avg) {
        this.initList();
      }
    });
  }
  render() {
    const { maxList } = this.state;
    var spots = maxList.map( spot => {
      return <PanelSpot spot={spot} key={spot.id} />;
    });
    return <div className="child-container last">
      <h1>
        <i className="ion-flash" />
        &nbsp;&nbsp;
        <span>
          Most windy places
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
