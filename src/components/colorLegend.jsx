import React from 'react';
import { getColor } from '../filters';
import PropTypes from 'prop-types';
import './css/colorLegend.css';
import { windUnit } from '../filters';
import store from '../store/store.js';

function ColorLegend() {

  let array = [];
  for(let i = 1; i <= 50; i++)
    if (i % 5 === 0) array.push(i);

  return <div id="color-legend">
    <div className="unit">
      {store.settings.windUnit}
    </div>
    {array.map( e => {
      let propsBlock = {
        className: 'value',
        key: e,
        style: {
          background:
            `linear-gradient(to right, ${getColor((e-5) * 1.853)}, ${getColor(e*1.853)})`
        }
      };
      return <div {...propsBlock}>
        {windUnit(e*1.852)}
      </div>;
    })}
  </div>;
}

ColorLegend.propTypes = {
  leftActive: PropTypes.bool,
  mobile: PropTypes.bool
};

export default ColorLegend;
