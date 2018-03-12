import hexToRgba from 'hex-rgba';
import store from '../store/store.js';

const color = [
  '#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',
  '#FFFFFF','#DCFDFC','#A5FAF7','#9AFAF6','#67F7F1',
  '#51F9BD','#36FB7E','#2BFC64','#09FE15','#0AFE00',
  '#5BFA00','#60F900','#B2F500','#CAF300','#FFED01',
  '#FFD606','#FFAC10','#FF9615','#FF6221','#FF4F25',
  '#FF3033','#FF2950','#FF2368','#FF226A','#FF1890',
  '#FF13A7','#FF0EB8','#FF0ACA','#FF08D1','#FF06DD',
  '#FF05E3','#FF03ED','#FF02F4','#FF00FE','#EA0AFF',
  '#E90BFF','#CF17FF','#C01EFF','#B324FF','#AD27FF',
  '#9532FF','#8a32fd','#8B33FF','#8634FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF','#7E35FF',
  '#7E35FF','#7E35FF','#7E35FF','#7E35FF'
];

const colorNumber = [
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF,
  0xFFFFFF,0xDCFDFC,0xA5FAF7,0x9AFAF6,0x67F7F1,
  0x51F9BD,0x36FB7E,0x2BFC64,0x09FE15,0x0AFE00,
  0x5BFA00,0x60F900,0xB2F500,0xCAF300,0xFFED01,
  0xFFD606,0xFFAC10,0xFF9615,0xFF6221,0xFF4F25,
  0xFF3033,0xFF2950,0xFF2368,0xFF226A,0xFF1890,
  0xFF13A7,0xFF0EB8,0xFF0ACA,0xFF08D1,0xFF06DD,
  0xFF05E3,0xFF03ED,0xFF02F4,0xFF00FE,0xEA0AFF,
  0xE90BFF,0xCF17FF,0xC01EFF,0xB324FF,0xAD27FF,
  0x9532FF,0x8a32fd,0x8B33FF,0x8634FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF,
  0x7E35FF,0x7E35FF,0x7E35FF,0x7E35FF
];


const humidityColor = [
  '#fefefe', '#fbfbfb', '#f5f5f5',
  '#efefef', '#efefef', '#e3e3e3',
  '#dddddd', '#d6d6d6', '#cecece',
  '#aaaaaa', '#979797'
];


const getColor = (value, number) => {
  if (value === '--')
    return !number ? '#FFFFFF' : 0xFFFFFF;
  else if (value / 1.852 <= 50)
    return !number ? color[Math.round((value /1.852))] : colorNumber[Math.round((value /1.852))];
  else
    return !number ? color[49] : colorNumber[49];
};


const windUnit = (value) => {
  const { windUnit } = store.settings;
  if ( value === '--' ) {
    return '--';
  } else if(windUnit === 'km/h') {
    const valueInKM = Math.round(value);
    return Math.round(valueInKM);
  } else if (windUnit === 'kt') {
    const valueInKT = Math.round(value/1.852);
    return valueInKT;
  } else if (windUnit === 'm/s') {
    const valueInMS = Math.round(value/3.6);
    return valueInMS;
  }
};


const getHumidityColor = value => {
  let level = Math.round(value/10);
  return humidityColor[level];
};


const getColorTemp = value => {
  value = value !== '--' ? Math.round(value) : value;
  if (value === '--')
    return 'rgba(255,255,255,0.25)';
  else if (value < 0 && value > -49)
    return hexToRgba(color[value*-1], 70);
  else if (value >= 0 && value < 50)
    return color[value];
  else if (value < -49 || value >=50)
    return color[49];
};

export {
  getColor,
  windUnit,
  getColorTemp,
  getHumidityColor
};
