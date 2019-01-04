import AppDispatcher from './dispatcher.js';

export var typeOfActions = {
  LEFT_ACTIVATION: 'LEFT_ACTIVATION',
  RIGHT_ACTIVATION: 'RIGHT_ACTIVATION',
  UPDATE_DETAIL: 'UPDATE_DETAIL',
  HOVER_ID: 'HOVER_ID',
  CHANGE_VIEWPORT: 'CHANGE_VIEWPORT',
  DATA_RECEIVED: 'DATA_RECEIVED',
  LOAD_ACTIVITY: 'LOAD_ACTIVITY',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  CHANGE_SETTINGS: 'CHANGE_SETTINGS',
  DISPLAY_STATION: 'DISPLAY_STATION',
  SCROLL_GRAPH_OBSERVATION: 'SCROLL_GRAPH_OBSERVATION',
  LOCATION_DETECTED: 'LOCATION_DETECTED'
};

export var Actions = {
  scrollGraphObservation(val) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.SCROLL_GRAPH_OBSERVATION,
      val
    });
  },
  displayStation(val) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.DISPLAY_STATION,
      val
    });
  },
  updateDetail(update) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.UPDATE_DETAIL,
      update
    });
  },
  loadActivity(value) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.LOAD_ACTIVITY,
      value
    });
  },
  leftActivation() {
    AppDispatcher.dispatch({
      actionType: typeOfActions.LEFT_ACTIVATION
    });
  },
  rightActivation() {
    AppDispatcher.dispatch({
      actionType: typeOfActions.RIGHT_ACTIVATION
    });
  },
  hoverId(id) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.HOVER_ID,
      id
    });
  },
  changeViewport(size) {
    AppDispatcher.dispatch({
      actionType: typeOfActions.CHANGE_VIEWPORT,
      size
    });
  },
  DataReceived() {
    AppDispatcher.dispatch({
      actionType: typeOfActions.DATA_RECEIVED
    });
  },
  addBookmark(id) {
    AppDispatcher.dispatch({
      id,
      actionType: typeOfActions.ADD_BOOKMARK
    });
  },
  changeSettings(object) {
    AppDispatcher.dispatch({
      object,
      actionType: typeOfActions.CHANGE_SETTINGS
    });
  },
  locationDetected(object) {
    console.log(
        '%c♥ ♥ ♥ longitude = ' + object.longitude + ' | latitude = ' + object.latitude + ' ♥ ♥ ♥',
        'background: black;' +
        'font-size: 12px;' +
        'color: pink;' +
        'padding: 7px;' +
        'border: 5px solid pink;'
      );
    AppDispatcher.dispatch({
      object,
      actionType: typeOfActions.LOCATION_DETECTED
    });
  }
};
