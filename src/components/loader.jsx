import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
import './css/loader.css';

class Loader extends Component {
  constructor(props) {
    super(props);
    this.updateLoadActivity = this.updateLoadActivity.bind(this);
    this.state = { loadActivity: store.loading };
  }
  componentDidMount() {
    store.on(typeOfActions.LOAD_ACTIVITY, this.updateLoadActivity);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.LOAD_ACTIVITY, this.updateLoadActivity);
  }
  updateLoadActivity() {
    this.setState({ loadActivity: store.loading });
  }
  render() {
    const { loadActivity } = this.state;
    const mainStyle = { display: loadActivity ? 'inherit' : 'none' };
    return <div id="loader" className="elements-ui-absolute" style={mainStyle}>
      <svg className="circular" width="100px" height="100px">
        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
      </svg>
    </div>;

  }
}

export default Loader;
