import { color, colorNumber } from './color.js';

const getColor = (value, number) => {
  if (value == null)
    return !number ? '#FFFFFF' : 0xFFFFFF;
  else if (value / 1.852 <= 50)
    return !number ? color[Math.round((value /1.852))] : colorNumber[Math.round((value /1.852))];
  else
    return !number ? color[49] : colorNumber[49];
};

export default getColor;
