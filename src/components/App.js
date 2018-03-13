import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { typeOfActions, Actions } from '../store/actions.js';
import debounce from 'debounce';
import store from '../store/store.js';
import LeftPanel from './leftPanel.jsx';
import RightPanel from './rightPanel.jsx';
import ContainerWidget from './containerWidget.jsx';
import Header from './header.jsx';
import Tooltip from './tooltip.jsx';
import ColorLegend from './colorLegend.jsx';
import Loader from './loader.jsx';
import ContainerMap from './containerMap.jsx';
import './css/app.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.updatePanelActive = this.updatePanelActive.bind(this);
    this.mainUpdate = this.mainUpdate.bind(this);
    this.updateDisplayDetail = this.updateDisplayDetail.bind(this);
    this.state = {
      leftActive: store.leftActive,
      rightActive: store.rightActive,
      displayDetail: store.displayDetail
    };
  }
  componentDidMount() {
    store.on(typeOfActions.LEFT_ACTIVATION, this.updatePanelActive);
    store.on(typeOfActions.RIGHT_ACTIVATION, this.updatePanelActive);
    store.on(typeOfActions.DISPLAY_DETAIL, this.updateDisplayDetail);
    store.on(typeOfActions.CHANGE_VIEWPORT, this.mainUpdate);
    store.on(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
    var resize = debounce( () => {
      Actions.changeViewport([window.innerWidth, window.innerHeight]);
    }, 200 );
    window.addEventListener('resize', resize);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.LEFT_ACTIVATION, this.updatePanelActive);
    store.removeListener(typeOfActions.RIGHT_ACTIVATION, this.updatePanelActive);
    store.removeListener(typeOfActions.DISPLAY_DETAIL, this.updateDisplayDetail);
    store.removeListener(typeOfActions.CHANGE_VIEWPORT, this.mainUpdate);
    store.removeListener(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
  }
  mainUpdate() {
    this.forceUpdate();
  }
  updateDisplayDetail() {
    this.setState({
      displayDetail: store.displayDetail
    });
  }
  updatePanelActive() {
    this.setState({
      leftActive: store.leftActive,
      rightActive: store.rightActive
    });
  }
  render() {
    const { displayDetail, leftActive, rightActive } = this.state;
    const propsWidget = { displayDetail, leftActive, rightActive };
    return <div id="ui" className="elements-ui-absolute">
      {!store.mobile
        ? <Tooltip displayDetail={displayDetail} rightActive={rightActive} />
        : ''
      }
      <ContainerMap displayDetail={displayDetail} />
      { displayDetail ? <ContainerWidget {...propsWidget} /> : '' }
      <ColorLegend mobile={store.mobile} leftActive={leftActive} displayDetail={displayDetail} />
      <LeftPanel leftActive={leftActive} />
      <RightPanel rightActive={rightActive} />
      <Header leftActive={leftActive} rightActive={rightActive}/>
      <Loader />
    </div>;
  }
}


App.propTypes = {
  data: PropTypes.object
};

export default App;
