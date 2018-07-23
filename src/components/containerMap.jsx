import assign from 'object-assign';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
// import WebglLayer from './webglLayer.jsx';
// import WebMercatorViewport from 'viewport-mercator-project';
// import { MapInteractionCSS } from 'react-map-interaction';
// import ReactMapGL from 'react-map-gl';
// import DragAndZoom from './dragAndZoom.jsx';


class ContainerMap extends Component {
  constructor(props) {
    super(props);

    this.resize = this.resize.bind(this);
    this.blured = this.blured.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.mouseUpTouchEnd = this.mouseUpTouchEnd.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.mouseWheel = this.mouseWheel.bind(this);
    this.mouseWheelFirefox = this.mouseWheelFirefox.bind(this);
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
    document.addEventListener('mousedown', this.mouseDown, false);
    document.addEventListener('touchstart', this.touchStart, false);
    document.addEventListener('mouseup', this.mouseUpTouchEnd, false);
    document.addEventListener('touchend', this.mouseUpTouchEnd, false);
    document.addEventListener('mousemove', this.mouseMove, false);
    document.addEventListener('touchmove', this.touchMove, false);

    document.addEventListener('mousewheel', this.mouseWheel, false);
    document.addEventListener('DOMMouseScroll', this.mouseWheelFirefox, false); // for firefox;

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
    // document.removeEventListener('mousemove', this.handleMouseMove, false);

    store.removeListener(typeOfActions.CHANGE_VIEWPORT, this.resize);
    store.removeListener(typeOfActions.DISPLAY_STATION, this.blured);
  }


  mouseDown(e) {
    this.dragging = true;
    this.coords = {
      x: e.pageX,
      y: e.pageY
    };
  }
  touchStart(e) {
    this.dragging = true;
    this.coords = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
    if (e.touches.length === 2) {
      this.touchScaling = true;
    }
  }

  mouseUpTouchEnd() {
    this.dragging = false;
    this.touchScaling = false;
    this.coords = {};
  }

  mouseMove(e) {
    if (this.dragging) {
      var xDiff = this.coords.x - e.pageX,
          yDiff = this.coords.y - e.pageY;
      this.coords.x = e.pageX;
      this.coords.y = e.pageY;
      let x = this.state.x - xDiff,
          y = this.state.y - yDiff;
      this.setState({x, y});
      console.log(e);
    }
  }

  touchMove(e) {
    if (this.dragging) {
      var xDiff = this.coords.x - e.changedTouches[0].pageX,
          yDiff = this.coords.y - e.changedTouches[0].pageY;
      this.coords.x = e.changedTouches[0].pageX;
      this.coords.y = e.changedTouches[0].pageY;
      let x = this.state.x - xDiff,
          y = this.state.y - yDiff;
      this.setState({x, y});

      if(this.touchScaling) {
        // let dist = Math.hypot(
        //     e.touches[0].pageX - e.touches[1].pageX,
        //     e.touches[0].pageY - e.touches[1].pageY);
      }
    }
  }

  isNegative(n) {
    return ((n = +n) || 1 / n) < 0;
  }
  mouseWheel(e) {
    var ZOOM_STEP = 0.04;
    console.log('zoom');
    let direction = (this.isNegative(e.deltaX) && this.isNegative(e.deltaY) ) ? 'down' : 'up';
    let { scale } = this.state;
    if (direction === 'down') {
      scale += ZOOM_STEP;
    } else {
      scale -= ZOOM_STEP;
    }
    this.setState({scale});
  }
  mouseWheelFirefox(e) {
    var ZOOM_STEP = 0.04;
    console.log('zoom');
    let direction = (this.isNegative(e.deltaX) && this.isNegative(e.deltaY) ) ? 'up' : 'down';
    let { scale } = this.state;
    if (direction === 'down') {
      scale += ZOOM_STEP;
    } else {
      scale -= ZOOM_STEP;
    }
    this.setState({scale});
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
        height: '200%',
        width: '100%'
      }
    };
    const propsChild = {
      style: {
        width: 300 * scale,
        height: 300 * scale,
        position: 'absolute',
        background: 'green',
        left: x + 'px',
        top: y + 'px',
        cursor: 'move'
      },
      ref: 'dragChild'
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
