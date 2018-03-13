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
import { Route, Redirect } from 'react-router-dom';
import './css/app.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.updatePanelActive = this.updatePanelActive.bind(this);
    this.mainUpdate = this.mainUpdate.bind(this);
    this.state = {
      leftActive: store.leftActive,
      rightActive: store.rightActive
    };
  }
  componentDidMount() {
    store.on(typeOfActions.MARKER_CLICKED, this.mainUpdate);
    store.on(typeOfActions.LEFT_ACTIVATION, this.updatePanelActive);
    store.on(typeOfActions.RIGHT_ACTIVATION, this.updatePanelActive);
    store.on(typeOfActions.CHANGE_VIEWPORT, this.mainUpdate);
    store.on(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
    var resize = debounce( () => {
      Actions.changeViewport([window.innerWidth, window.innerHeight]);
    }, 200 );
    window.addEventListener('resize', resize);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.MARKER_CLICKED, this.mainUpdate);
    store.removeListener(typeOfActions.LEFT_ACTIVATION, this.updatePanelActive);
    store.removeListener(typeOfActions.RIGHT_ACTIVATION, this.updatePanelActive);
    store.removeListener(typeOfActions.CHANGE_VIEWPORT, this.mainUpdate);
    store.removeListener(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
  }
  mainUpdate() {
    this.forceUpdate();
  }
  updatePanelActive() {
    this.setState({
      leftActive: store.leftActive,
      rightActive: store.rightActive
    });
  }
  render() {
    const {
      leftActive,
      rightActive
    } = this.state;

    return <div id="ui" className="elements-ui-absolute">

      {/* common for / and /station/@id */}
      <Route path="/" render={routeProps => <ContainerMap {...routeProps}/>} />
      <LeftPanel leftActive={leftActive} />
      <RightPanel rightActive={rightActive} />
      <Header leftActive={leftActive} rightActive={rightActive}/>
      <Loader />

      {/* only for path /station/@id */}
      <Route path={'/station/:stationId'} component={ContainerWidget} />
      <Route exact path={'/station'} render={() => <Redirect to="/" />} />

      {/* only for exact path / */}
      <Route exact path="/" render={() => <ColorLegend mobile={store.mobile} leftActive={leftActive} />} />
      {!store.mobile
        ? <Route exact path="/" render={() => <Tooltip rightActive={rightActive} />}/>
        : ''
      }
    </div>;
  }
}


App.propTypes = {
  data: PropTypes.object
};

export default App;
