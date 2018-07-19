import hexToRgba from 'hex-rgba';
import { color } from './color.js';

const getColorTemp = value => {
  value = value != null ? Math.round(value) : value;
  if (value == null)
    return 'rgba(255,255,255,0.25)';
  else if (value < 0 && value > -49)
    return hexToRgba(color[value*-1], 70);
  else if (value >= 0 && value < 50)
    return color[value];
  else if (value < -49 || value >=50)
    return color[49];
};

export default getColorTemp;
