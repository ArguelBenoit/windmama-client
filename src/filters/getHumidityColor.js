import { humidityColor } from './color.js';

const getHumidityColor = value => {
  let level = Math.round(value/10);
  return humidityColor[level];
};

export default getHumidityColor;
