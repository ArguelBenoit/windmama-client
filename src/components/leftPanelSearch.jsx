import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import debounce from 'debounce';
import smartSearch from 'smart-search';
import PanelSpot from './panelSpot.jsx';
import moment from 'moment';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';

class LeftPanelSearch extends Component {
  constructor(props) {
    super(props);
    this.dataReceived = this.dataReceived.bind(this);
    this.updateSpotList = debounce(this.updateSpotList, 500);
    this.state = {
      nbrSpot: 0,
      dataReceived: false,
      spotsList: [],
      search: ''
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
    this.setState({ nbrSpot: this.allName.length, dataReceived: true });
  }
  updateSpotList() {
    const { windObservation } = store;
    const search = this.refs.searchInput.value;
    let newSpotsList;
    if(search !== '') {
      const windObservationInArray = _.values(windObservation);
      const valuesSarch = {
        address1: true,
        address2: true,
        address3: true,
        name: true
        // id, items, lat, lng, name, type
      };
      const arraySearch = search.split(' ');
      newSpotsList = smartSearch(
        windObservationInArray,
        arraySearch,
        valuesSarch
      );
      newSpotsList.sort((a, b) => {
        if (a.entry.items[0].avg < b.entry.items[0].avg)
          return 1;
        else if (a.entry.items[0].avg > b.entry.items[0].avg)
          return -1;
        else
          return -1;
      });
      newSpotsList = newSpotsList.slice(0, 60).map(el => {
        let diff = moment().valueOf() - moment(el.entry.items[0].date).valueOf();
        return {
          name: el.entry.name,
          type: el.entry.type,
          id: el.entry.id,
          heading: el.entry.items[0].heading,
          avg: el.entry.items[0].avg,
          connected: diff < 3600000 ? true : false,
          raw: el.entry.items[0].raw ? el.entry.items[0].raw : null
        };
      });
    } else {
      newSpotsList = [];
    }
    this.setState({
      spotsList: newSpotsList,
      search
    });
  }
  render() {
    const {
      search,
      nbrSpot,
      dataReceived,
      spotsList
    } = this.state;
    const propsInput = {
      id: 'research',
      type: 'text',
      placeholder: 'Search',
      ref: 'searchInput',
      onChange: this.updateSpotList.bind(this),
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
    if (dataReceived) {
      return <div>
        <i {...propsIcon} /><input {...propsInput} />
        <div className="child-container">
          <div className="container-panelSpot">
            {search !== '' ?
              spotsList.map( e => {
                return <PanelSpot spot={e} key={e.name} />;
              })
              : ''
            }
            <div style={{display: search !== '' ? 'none' : 'inherit'}}>
              Find among {nbrSpot} stations with postal code, city, country code, type, id or name.
            </div>
            <div className="error" style={{display: search !== '' && spotsList.length === 60 ? 'inherit' : 'none'}}>
              Windmama show maximum 60 places, please refine your search
            </div>
            <div className="error" style={{display: search !== '' && spotsList.length === 0 ? 'inherit' : 'none'}}>
              We have no results
            </div>
          </div>
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}

LeftPanelSearch.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanelSearch;
