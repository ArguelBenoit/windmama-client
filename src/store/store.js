import init from './connect.js';
import { EventEmitter } from 'events';
import _ from 'lodash';

var store = _.assign(
  init,
  EventEmitter.prototype
);

export default store;
