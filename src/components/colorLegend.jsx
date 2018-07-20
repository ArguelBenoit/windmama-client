import React from 'react';
import { getColor } from '../filters';
import PropTypes from 'prop-types';
import './css/colorLegend.css';
import { windUnit } from '../filters';

function ColorLegend() {
  const array = [];
  for(let i = 1; i <= 50; i++)
    array.push(i);

  return <div id="color-legend">
    {array.map( e => {
      return <div className="legend-block" key={e} style={{ background: getColor(e*1.853) }}>
        <div>{windUnit(e*1.852)}</div>
      </div>;
    })}
  </div>;
}

ColorLegend.propTypes = {
  leftActive: PropTypes.bool,
  mobile: PropTypes.bool
};

export default ColorLegend;
