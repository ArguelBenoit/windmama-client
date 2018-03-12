import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
import './css/loader.css';
import img from './img/solar.png';

class Loader extends Component {
  constructor(props) {
    super(props);
    this.updateLoadActivity = this.updateLoadActivity.bind(this);
    this.state = { loadActivity: true };
  }
  componentDidMount() {
    store.on(typeOfActions.LOAD_ACTIVITY, this.updateLoadActivity);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.LOAD_ACTIVITY, this.updateLoadActivity);
  }
  updateLoadActivity() {
    this.setState({ loadActivity: !this.state.loadActivity });
  }
  render() {
    const { loadActivity } = this.state;
    const mainStyle = { display: loadActivity ? 'inherit' : 'none' };
    return <div id="loader" className="elements-ui-absolute" style={mainStyle}>
      <img id="solar1" src={img} alt=""/>
    </div>;
  }
}

export default Loader;
