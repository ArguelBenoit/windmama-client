import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelSpot from './panelSpot.jsx';
import moment from 'moment';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';

class LeftPanelSearch extends Component {
  constructor(props) {
    super(props);
    this.dataReceived = this.dataReceived.bind(this);
    this.state = {
      search: '',
      nbrSpot: 0
    };
  }
  componentDidMount() {
    store.on(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  dataReceived() {
    const { windObservation } = store;
    this.allName = Object.keys(windObservation);
    this.setState({ nbrSpot: this.allName.length });
  }
  handleChange(e) {
    this.setState({ search: e.target.value });
  }
  render() {
    const { search, nbrSpot } = this.state;
    const { windObservation } = store;

    let spotsList = [];
    if (this.allName && search !== '') {
      this.allName.forEach( name => {
        let nameDetail = windObservation[name].items[0];
        let nameInfo = windObservation[name];

        if (nameInfo.id.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.type.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.id.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.address1.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.address2.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            nameInfo.address3.toLowerCase().indexOf(search.toLowerCase()) >= 0)
        {
          let diff = moment().valueOf() - moment(nameDetail.date).valueOf();
          spotsList.push({
            name: nameInfo.name,
            type: nameInfo.type,
            id: nameInfo.id,
            heading: nameDetail.heading,
            avg: nameDetail.avg,
            connected: diff < 3600000 ? true : false,
            raw: nameDetail.raw ? nameDetail.raw : null
          });
        }
      });

      spotsList.sort((a, b) => {
        if (a.avg < b.avg)
          return 1;
        else if (a.avg > b.avg)
          return -1;
        else
          return -1;
      });

      spotsList = spotsList.slice(0, 60).map((spot) => {
        return <PanelSpot spot={spot} key={spot.id} />;
      });
    }

    const propsInput = {
      id: 'research',
      type: 'text',
      placeholder: 'Search',
      value: search,
      onChange: this.handleChange.bind(this),
      style: {
        borderBottom: '2px solid #ff4081',
        padding: '13px 0 13px 40px'
      }
    };
    const propsIcon = {
      className: 'fas fa-search',
      style: {
        position: 'absolute',
        fontSize: 'large',
        top: '14px',
        left: '12px'
      }
    };
    return <div>
      <i {...propsIcon} /><input {...propsInput} />
      <div className="child-container">
        {search !== '' ? spotsList : ''}
        <div style={{display: search !== '' ? 'none' : 'inherit'}}>
          Find among {nbrSpot} stations with postal code, city, country code, type, id or name.
        </div>
        <div className="error" style={{display: spotsList.length === 60 ? 'inherit' : 'none'}}>
          Windmama show maximum 60 places, please refine your search
        </div>
        <div className="error" style={{display: search !== '' && spotsList.length === 0 ? 'inherit' : 'none'}}>
          We have no results
        </div>
      </div>
    </div>;
  }
}

LeftPanelSearch.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanelSearch;
