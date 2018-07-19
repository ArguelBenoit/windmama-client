import React from 'react';
import PropTypes from 'prop-types';
import store from '../store/store.js';

function RainUnit(props) {
  const { value } = props;
  const { rainUnit } = store.settings;
  if ( value == null
      || value === 0
      || value === '0') {
    return '--';
  } else if (rainUnit === 'picto') {
    return <i className="ion-waterdrop" aria-hidden="true" />;
  } else {
    return value;
  }
}

RainUnit.propTypes = {
  value: PropTypes.any
};

export default RainUnit;
