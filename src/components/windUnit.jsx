import PropTypes from 'prop-types';
import store from '../store/store.js';

function WindUnit(props) {
  const { value } = props;
  const { windUnit } = store.settings;
  if (!value) {
    return '--';
  } else if(windUnit === 'km/h') {
    const valueInKM = Math.round(value);
    return valueInKM;
  } else if (windUnit === 'kt') {
    const valueInKT = Math.round(value/1.852);
    return valueInKT;
  } else if (windUnit === 'm/s') {
    const valueInMS = Math.round(value/3.6);
    return valueInMS;
  }
}

WindUnit.propTypes = {
  value: PropTypes.any
};

export default WindUnit;
