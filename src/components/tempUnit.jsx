import PropTypes from 'prop-types';
import store from '../store/store.js';

function TempUnit(props) {
  const { value } = props;
  const { tempUnit } = store.settings;
  if ( value == null ) {
    return '--';
  } else if(tempUnit === 'C') {
    const valueInC = Math.round(value);
    return valueInC + '°';
  } else if (tempUnit === 'F') {
    const valueInF = Math.round((value*1.8)+32);
    return valueInF + '°';
  }
}

TempUnit.propTypes = {
  value: PropTypes.any
};

export default TempUnit;
