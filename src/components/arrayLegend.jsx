import React from 'react';
import PropTypes from 'prop-types';

function ArrayLegend(props) {
  const { presentsKeys } = props;
  return <table className="legend-array-widget">
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
  presentsKeys: PropTypes.array
};

export default ArrayLegend;
