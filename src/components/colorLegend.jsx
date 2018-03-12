import React from 'react';
import { getColor } from '../filters';
import PropTypes from 'prop-types';
import './css/colorLegend.css';

function ColorLegend(props) {
  const { leftActive, displayDetail, mobile } = props;
  const array = [];
  for(let i = 0; i < 50; i++)
    array.push(i);

  let marginLeft;
  if (mobile)
    marginLeft = 8;
  else if (leftActive)
    marginLeft = 268;
  else
    marginLeft = 8;

  return <div id="color-legend" style={{ left: marginLeft, display: !displayDetail ? 'inherit' : 'none' }}>
    <div className="legend-block" style={{ width: 20 }} key={'e'}>{'0kt'}</div>
    {array.map( e => {
      return <div className="legend-block" key={e} style={{ background: getColor(e*1.853) }} />;
    })}
    <div className="legend-block" style={{ width: 40 }} key={'r'}>{'+50kt'}</div>
  </div>;
}

ColorLegend.propTypes = {
  leftActive: PropTypes.bool,
  displayDetail: PropTypes.any,
  mobile: PropTypes.bool
};

export default ColorLegend;
