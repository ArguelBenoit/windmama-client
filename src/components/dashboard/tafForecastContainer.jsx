import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import store from '../../store/store.js';




class TafForecastContainer extends Component {
  constructor(props) {
    super(props);
    this.zuluOrNotZulu = this.zuluOrNotZulu.bind(this);
  }
  zuluOrNotZulu(date) {
    let { universalTime } = store.settings;
    if (universalTime) {
      return moment.utc(date).format('H');
    } else {
      return moment(date).format('H');
    }
  }
  render() {
    const { taf } = this.props;
    let tafStatic = {},
        tafDynamic = {};

    taf.items.forEach( e => {

      if (e.indicator === null) {
        let dateTimeFrom = new Date(e.timeFrom),
            timeFrom = dateTimeFrom.getTime();
        let dateTimeTo = new Date(e.timeTo),
            timeTo = dateTimeTo.getTime();
        let timeWhile = timeFrom;
        while(timeWhile < timeTo) {
          tafStatic[this.zuluOrNotZulu(timeWhile)] = e;
          timeWhile = timeWhile + 3600000;
        }

      } else if (e.indicator === 'BECMG') {
        let dateTimeFrom = new Date(e.timeFrom),
            timeFrom = dateTimeFrom.getTime();
        let dateTimeTo = new Date(e.timeTo),
            timeTo = dateTimeTo.getTime();
        let dateTimeBcmg = new Date(e.timeBecmg),
            timeBecmg = dateTimeBcmg.getTime();
        let timeWhile = timeFrom;
        const nbrHourBcmg = Number(moment(timeBecmg - timeFrom).format('H')) - 1 ;
        let indexWhile = 0;
        while(timeWhile < timeTo) {
          if (timeWhile < timeBecmg) {
            tafStatic[this.zuluOrNotZulu(timeWhile)] = e;
            indexWhile += 1;
          } else {
            tafStatic[this.zuluOrNotZulu(timeWhile)] = e;
          }
          timeWhile = timeWhile + 3600000;
        }
        console.log();

      } else if (e.indicator === 'TEMPO') {
        // console.log('un tempo');
      } else if (e.indicator === 'PROB') {
        // console.log('un tempo');
      } else {
        // console.log(`tu as oublié ${e.indicator}`);
      }
    });

    let styleDiv = {
      height: 300,
      background: 'green'
    };
    return <div className="widget-taf-forecast" style={styleDiv} />;
  }
}

TafForecastContainer.propTypes = {
  taf: PropTypes.object.isRequired
};

export default TafForecastContainer;
