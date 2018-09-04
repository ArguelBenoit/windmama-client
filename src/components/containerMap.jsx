import assign from 'object-assign';
import ReactMapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
import WebglLayer from './webglLayer.jsx';

class ContainerMap extends Component {
  constructor(props) {
    super(props);
    this._onChangeViewport = this._onChangeViewport.bind(this);
    this._resize = this._resize.bind(this);
    this.blured = this.blured.bind(this);
    const { viewportWidth, viewportHeight } = store;
    this.state = {
      blured: store.displayStation,
      viewport: {
        latitude: 48.86,
        longitude: 2.33,
        zoom: 2,
        width: viewportWidth,
        height: viewportHeight
      },
      mapboxDepend: {
        dragRotate: false,
        mapStyle: 'mapbox://styles/arguelbenoit/cjbpb726a6q8h2rt3jr86ngal',
        mapboxApiAccessToken: 'pk.eyJ1IjoiYXJndWVsYmVub2l0IiwiYSI6ImNpczN0aTRpbjAwMWQyb3FkM3d4d3dweWwifQ.TuZpfqS-HyuaUzbe1fIiTg'
      }
    };
  }
  componentDidMount() {
    store.on(typeOfActions.CHANGE_VIEWPORT, this._resize);
    store.on(typeOfActions.DISPLAY_STATION, this.blured);
    if (navigator.geolocation) { // if loc active
      navigator.geolocation.getCurrentPosition( position => {
        const { viewportWidth, viewportHeight } = store;
        let viewport = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 7,
          width: viewportWidth,
          height: viewportHeight
        };
        this._onChangeViewport(viewport);
      });
    }
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.CHANGE_VIEWPORT, this._resize);
    store.removeListener(typeOfActions.DISPLAY_STATION, this.blured);
  }
  blured() {
    this.setState({blured: store.displayStation});
  }
  _resize() {
    const { viewportWidth, viewportHeight } = store;
    this.setState({
      viewport: assign({}, this.state.viewport, {width: viewportWidth, height: viewportHeight})
    });
  }
  _onChangeViewport(newViewport) {
    const viewport = assign({}, this.state.viewport, newViewport);
    this.setState({viewport});
  }
  render() {
    const { viewport, mapboxDepend, blured } = this.state;
    return <div id="map" style={{ filter: blured ? 'blur(10px)' : 'blur(0px)'}}>
      <ReactMapGL style={{cursor: 'move'}} onViewportChange={this._onChangeViewport} {...viewport} {...mapboxDepend}>
        <WebglLayer history={this.props.history} viewport={viewport} />
      </ReactMapGL>
    </div>;
  }
}

ContainerMap.propTypes = {
  displayDetail: PropTypes.any,
  history: PropTypes.object
};

export default ContainerMap;
