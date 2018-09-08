import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LeftPanelPowerfull from './leftPanelPowerfull.jsx';
import LeftPanelBookmarks from './leftPanelBookmarks.jsx';
import LeftPanelSearch from './leftPanelSearch.jsx';
import LeftPanelAroundUser from './leftPanelAroundUser.jsx';
import store from '../store/store.js';
import { Scrollbars } from 'react-custom-scrollbars';
import './css/panel.css';
import './css/leftPanel.css';
import { typeOfActions } from '../store/actions.js';

class LeftPanel extends Component {
  constructor(props) {
    super(props);
    this.dataReceived = this.dataReceived.bind(this);
    this.state = {
      dataReceived: false
    };
  }
  componentDidMount() {
    store.on(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.DATA_RECEIVED, this.dataReceived);
  }
  dataReceived () {
    this.setState({
      dataReceived: true
    });
  }
  render() {
    const { leftActive } = this.props;
    const propsLeftPanel = {
      className: (leftActive ? ' ' : 'active ') + (!this.state.dataReceived ? ' background-leftpanel' : ''),
      id: 'left-panel',
      style: {
        height: store.viewportHeight - 80 // viewport height - header height
      }
    };
    return <div {...propsLeftPanel}>
      <Scrollbars style={{height: store.viewportHeight - 80 }} >
        <LeftPanelSearch />
        <LeftPanelAroundUser />
        <LeftPanelBookmarks />
        <LeftPanelPowerfull />
      </Scrollbars>
    </div>;
  }
}

LeftPanel.propTypes = {
  leftActive: PropTypes.bool
};

export default LeftPanel;
