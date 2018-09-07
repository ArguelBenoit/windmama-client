import React from 'react';
import PropTypes from 'prop-types';
// import store from '../../store/store.js';

function ArrayLegend(props) {
  const { presentsKeys, margin } = props;
  return <table className="legend-array-widget" style={{marginTop: margin}}>
    <tbody>
      {presentsKeys.map( key => {
        return <tr key={key}>
          <td>{key.substring(0, 4)}</td>
        </tr>;
      })}
    </tbody>
  </table>;
}

ArrayLegend.propTypes = {
  presentsKeys: PropTypes.array,
  margin: PropTypes.number
};

export default ArrayLegend;
