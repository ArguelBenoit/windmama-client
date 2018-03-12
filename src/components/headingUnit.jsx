import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getColor } from '../filters';
import ReactDOM from 'react-dom';
import store from '../store/store.js';

class HeadingUnit extends Component {
  constructor(props) {
    super(props);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.canvasCreator = this.canvasCreator.bind(this);
  }
  componentDidMount() {
    this.canvasCreator();
  }
  componentDidUpdate() {
    this.clearCanvas();
    this.canvasCreator();
  }
  canvasCreator() {
    let { max, heading } = this.props;
    const { headingUnit } = store.settings;
    if(headingUnit === 'arrow' && heading !== '--') {
      const color = getColor(max);
      let canvas = ReactDOM.findDOMNode(this.canvas);
      canvas.style.height = '20px';
      canvas.style.width = '20px';
      let ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(8, 6);
      ctx.lineTo(20, 35);
      ctx.lineTo(32 ,6);
      ctx.lineTo(20, 11);
      ctx.closePath();
      ctx.lineJoin = 'round';
      ctx.fillStyle = color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
  }
  clearCanvas() {
    const { headingUnit } = store.settings;
    if(headingUnit === 'arrow') {
      let canvas = ReactDOM.findDOMNode(this.canvas);
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 40, 40);
    }
  }
  render () {
    let { heading } = this.props;
    const { headingUnit } = store.settings;
    if ( heading === '--' ) {
      return '--';
    } else if(headingUnit === 'arrow') {
      const props = {
        ref: el => { this.canvas = el; },
        width: 40,
        height: 40,
        style: {
          transform: `rotate(${heading}deg)`
        }
      };
      return <canvas {...props} />;
    } else if (headingUnit === 'degrees') {
      return `${Math.round(heading)}°`;
    } else if (headingUnit === 'abbrev') {
      const abbrevArray = [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW',
        'N'
      ];
      return abbrevArray[Math.round(heading/22.5)];
    }
  }
}

HeadingUnit.propTypes = {
  max: PropTypes.any,
  heading: PropTypes.any,
  backgroundLighter: PropTypes.bool
};

export default HeadingUnit;
