import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import store from '../../store/store.js';
import { typeOfActions } from '../../store/actions.js';

class InfoDate extends Component {
  constructor(props) {
    super(props);
    let { date } = this.props;
    this.updateTime = this.updateTime.bind(this);
    this.mainUpdate = this.mainUpdate.bind(this);
    this.state = {
      last: date,
      diff: moment.utc(moment().diff(date))
    };
  }
  componentDidMount() {
    store.on(typeOfActions.UPDATE_DETAIL, this.mainUpdate);
    this.updateTime();
  }
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps');
    let { date } = nextProps;
    this.setState({
      last: date,
      diff: moment.utc(moment().diff(date))
    });
  }
  componentWillUnmount() {
    clearInterval(this.updateSeconds);
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.mainUpdate);
  }
  mainUpdate() {
    if (store.idUpdate === this.props.name) {
      let { date } = this.props;
      this.setState({
        last: date,
        diff: moment.utc(moment().diff(date))
      });
    }
  }
  updateTime() {
    this.updateSeconds = setInterval(() => {
      this.setState({
        diff: moment(this.state.diff).add(1, 'seconds')
      });
    }, 1000);
  }
  render() {
    let diff = moment(this.state.diff).format('m [minutes and] s [seconds]') + ' ago';
    if (moment(this.state.diff).valueOf() > 3600000)
      diff = 'More than an hour ago';
    if (store.settings.universalTime) {
      return <div className="location-time-info">
        {`Last report : ${moment(this.state.last).utcOffset(+0).format('D MMMM')} - ${moment(this.state.last).utcOffset(+0).format('HH:mm')} utc`}
        <br/>
        {diff}
      </div>;
    } else {
      return <div className="location-time-info">
        {`Last report : ${moment(this.state.last).format('D MMMM')} - ${moment(this.state.last).calendar()}`}
        <br/>
        {diff}
      </div>;
    }
  }
}

InfoDate.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string
};
export default InfoDate;
