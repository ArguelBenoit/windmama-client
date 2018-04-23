import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
import moment from 'moment';
import _ from 'lodash';
import { getColor } from '../filters';
import { Actions } from '../store/actions.js';
import WebMercatorViewport from 'viewport-mercator-project';
import markerImage from './img/marker.png';


class WebglLayer extends Component {
  constructor(props){
    super(props);
    this.initLocations = this.initLocations.bind(this);
    this.markerGeneration = this.markerGeneration.bind(this);
    this.updateSensor = this.updateSensor.bind(this);
    this.drawMarker = this.drawMarker.bind(this);
    this.moveMarkers = this.moveMarkers.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.state = {
      locations: {},
      allId: [],
      markerInit: false,
      refWebGLId: {}
    };
  }
  componentDidMount() {
    store.on(typeOfActions.DATA_RECEIVED, this.initLocations);
    store.on(typeOfActions.UPDATE_DETAIL, this.updateSensor);
    this.app = new PIXI.Application({
      width: store.viewportWidth,
      height: store.viewportHeight,
      transparent: true,
      antialias: true,
      view: this.refs.canvas,
      autoResize:true,
      resolution: 2
    });
    this.graphicsContainer = new PIXI.Container();
  }
  componentDidUpdate(prevProps) {
    const { viewport } = this.props;
    const { markerInit } = this.state;
    if (viewport.height !== prevProps.viewport.height ||
        viewport.width !== prevProps.viewport.width  ) {
      this.resizeCanvas();
    } else if (prevProps.viewport !== viewport && markerInit) {
      this.moveMarkers();
    }
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.DATA_RECEIVED, this.initLocations);
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateSensor);
  }
  initLocations() {
    const { detail, place } = store;
    const allId = _.intersection(Object.keys(detail), Object.keys(place));
    let locations = this.state.locations;
    allId.forEach((id, i) => {
      let oneDetail = detail[id];
      const diff = moment().valueOf() - moment(oneDetail.date).valueOf();
      locations[id] = {
        longitude: place[id][1],
        latitude: place[id][0],
        heading: oneDetail.heading,
        max: oneDetail.max,
        avg: oneDetail.avg,
        id,
        connected: diff < 3600000 ? true : false,
        webglRef: i
      };
    });
    this.setState({
      locations,
      allId,
      markerInit: true
    });
    this.markerGeneration();
  }
  markerGeneration() {
    const { allId } = this.state;
    const { width, zoom, height, latitude, longitude } = this.props.viewport;
    const mercator = new WebMercatorViewport({
      longitude,
      latitude,
      zoom,
      width,
      height
    });
    allId.forEach( id => {
      let marker = new PIXI.Sprite.fromImage(markerImage);
      const onHover = () => Actions.hoverId(id);
      const onClick = () => {
        this.props.history.push(`/station/${id}`);
        Actions.loadActivity(true);
      };
      marker.on('mouseover', onHover);
      marker.on('click', onClick);
      marker.on('tap', onClick);
      this.app.stage.addChild(this.drawMarker(id, marker, mercator));
    });
  }
  drawMarker(id, marker, mercator) {

    const { locations } = this.state;
    let mercatorProject = mercator.project(
      [
        locations[id].longitude,
        locations[id].latitude
      ]
    );

    let color = getColor(locations[id].avg, true);
    marker.tint = color;
    marker.id = id;
    if (!locations[id].connected) {
      marker.alpha = 0.5;
    } else {
      marker.alpha = 1.0;
    }
    marker.anchor = {
      x: 0.5,
      y: 0.5
    };
    marker.height = 17;
    marker.width = marker.height;
    marker.rotation = locations[id].heading * 0.0174533;
    marker.x = mercatorProject[0];
    marker.y = mercatorProject[1];

    marker.interactive = true;
    marker.buttonMode = true;
    return marker;
  }
  resizeCanvas() {
    const { width, height } = this.props.viewport;
    this.app.renderer.resize(width, height);
    this.moveMarkers();
  }
  moveMarkers() {
    const { width, zoom, height, latitude, longitude } = this.props.viewport;
    const { locations } = this.state;
    const mercator = new WebMercatorViewport({
      longitude,
      latitude,
      zoom,
      width,
      height
    });
    this.app.stage.children.forEach( el => {
      let mercatorProject = mercator.project(
        [
          locations[el.id].longitude,
          locations[el.id].latitude
        ]
      );
      el.x = mercatorProject[0];
      el.y = mercatorProject[1];
    });
  }
  updateSensor() {
    if (this.state.markerInit) {
      var { detail, place, idUpdate } = store;
      const idMarker = this.state.locations[idUpdate].webglRef;
      let tempState = this.state.locations;
      if (place[idUpdate] && detail[idUpdate]) {
        detail = detail[idUpdate];
        const diff = moment().valueOf() - moment(detail.date).valueOf(); // Object Date instead moment.js
        tempState[idUpdate] = {
          longitude: place[idUpdate][1],
          latitude: place[idUpdate][0],
          heading: detail.heading,
          max: detail.max,
          avg: detail.avg,
          id: detail.id,
          connected: diff < 3600000 ? true : false,
          webglRef: idMarker
        };
      }
      this.setState({ locations: tempState });
      const { width, zoom, height, latitude, longitude } = this.props.viewport;
      const mercator = new WebMercatorViewport({
        longitude,
        latitude,
        zoom,
        width,
        height
      });
      const sprite = this.app.stage.children[idMarker];
      this.drawMarker(sprite.id, sprite, mercator);
    }
  }
  render() {
    const canvasProps = {
      style: {
        position: 'fixed',
        zIndex: 1000
      },
      ref: 'canvas'
    };
    return <canvas {...canvasProps} />;
  }
}

WebglLayer.propTypes = {
  locations: PropTypes.object,
  viewport: PropTypes.object,
  history: PropTypes.object
};

export default WebglLayer;
