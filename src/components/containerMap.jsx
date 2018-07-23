import assign from 'object-assign';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
// import WebglLayer from './webglLayer.jsx';
// import WebMercatorViewport from 'viewport-mercator-project';
// import { MapInteractionCSS } from 'react-map-interaction';
// import ReactMapGL from 'react-map-gl';
import DragAndZoom from './dragAndZoom.jsx';

class ContainerMap extends Component {
  constructor(props) {
    super(props);

    this.resize = this.resize.bind(this);
    this.blured = this.blured.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUpTouchEnd = this.handleMouseUpTouchEnd.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.isNegative = this.isNegative.bind(this);

    this.state = {
      blured: store.displayStation,
      // latitude: 48.86,
      // longitude: 2.33,
      x: 0,
      y: 0,
      scale: 1,
      width: store.viewportWidth,
      height: store.viewportHeight,
      mapboxDepend: {
        dragRotate: false,
        mapStyle: 'mapbox://styles/arguelbenoit/cjbpb726a6q8h2rt3jr86ngal',
        mapboxApiAccessToken: 'pk.eyJ1IjoiYXJndWVsYmVub2l0IiwiYSI6ImNpczN0aTRpbjAwMWQyb3FkM3d4d3dweWwifQ.TuZpfqS-HyuaUzbe1fIiTg'
      }
    };
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove, false);

    store.on(typeOfActions.CHANGE_VIEWPORT, this.resize);
    store.on(typeOfActions.DISPLAY_STATION, this.blured);

    if (navigator.geolocation) { // if loc active
      navigator.geolocation.getCurrentPosition( position => {
        let viewport = this.state.viewport;
        viewport.latitude = position.coords.latitude;
        viewport.longitude = position.coords.longitude;
        viewport.zoom = 7;
        this.setState({ viewport });
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove, false);

    store.removeListener(typeOfActions.CHANGE_VIEWPORT, this.resize);
    store.removeListener(typeOfActions.DISPLAY_STATION, this.blured);
  }

  handleMouseDown(e) {
    this.dragging = true;
    this.coords = {
      x: e.pageX,
      y: e.pageY
    };
  }
  handleTouchStart(e) {
    this.dragging = true;
    this.coords = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
  }

  handleMouseUpTouchEnd() {
    this.dragging = false;
    this.coords = {};
  }

  handleMouseMove(e) {
    if (this.dragging) {
      e.preventDefault();
      var xDiff = this.coords.x - e.pageX,
          yDiff = this.coords.y - e.pageY;
      this.coords.x = e.pageX;
      this.coords.y = e.pageY;
      let x = this.state.x - xDiff,
          y = this.state.y - yDiff;
      this.setState({x, y});
    }
  }
  handleTouchMove(e) {
    if (this.dragging) {
      e.preventDefault();
      var xDiff = this.coords.x - e.changedTouches[0].pageX,
          yDiff = this.coords.y - e.changedTouches[0].pageY;
      this.coords.x = e.changedTouches[0].pageX;
      this.coords.y = e.changedTouches[0].pageY;
      let x = this.state.x - xDiff,
          y = this.state.y - yDiff;
      this.setState({x, y});
    }
  }

  isNegative(n) {
    return ((n = +n) || 1 / n) < 0;
  }
  handleMouseWheel(e) {
    var ZOOM_STEP = .03;

    e.preventDefault();
    let direction = (this.isNegative(e.deltaX) && this.isNegative(e.deltaY) ) ? 'down' : 'up';

    let { scale } = this.state;
    if (direction === 'down') {
      scale += ZOOM_STEP;
    } else {
      scale -= ZOOM_STEP;
    }
    // scale = this.state.scale < 0 ? 0 : this.state.scale;
    this.setState({scale});
    console.log(scale);
  }
  blured() {
    this.setState({blured: store.displayStation});
  }
  resize() {
    const { viewportWidth, viewportHeight } = store;
    this.setState({
      viewport: assign({}, this.state.viewport, {width: viewportWidth, height: viewportHeight})
    });
  }
  render() {
    const { blured, y, x, scale} = this.state;
    const propsMap = {
      id: 'map',
      style: {
        filter: blured ? 'blur(10px)' : 'blur(0px)',
        height: '100%',
        width: '100%'
      }
    };
    const propsChild = {
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleTouchStart,
      onMouseUp: this.handleMouseUpTouchEnd,
      onTouchEnd: this.handleMouseUpTouchEnd,
      onTouchMove: this.handleTouchMove,
      onWheel: this.handleMouseWheel,
      style: {
        width: 300 * scale,
        height: 300 * scale,
        position: 'absolute',
        background: 'green',
        left: x + 'px',
        top: y + 'px',
        cursor: 'move'
      }
    };
    return <div {...propsMap}>
      <div {...propsChild}/>
    </div>;
  }
}
// <WebglLayer history={this.props.history} viewport={viewport} />

ContainerMap.propTypes = {
  displayDetail: PropTypes.any,
  history: PropTypes.object
};

export default ContainerMap;
