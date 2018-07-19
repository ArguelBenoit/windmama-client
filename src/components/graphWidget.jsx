import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { getColor, windUnit } from '../filters';

class GraphWidget extends Component {
  constructor(props) {
    super(props);
    this.widthPlot = 50;
    this.heightCanvas = 200;
  }
  componentDidMount() {
    this.canvasCreator();
  }
  componentDidUpdate() {
    this.canvasCreator();
  }
  clearCanvas() {
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(
      0,
      0,
      this.heightCanvas,
      361 * this.widthPlot
    );
  }
  canvasCreator() {
    let { items } = this.props.detail;
    const { widthPlot, heightCanvas } = this;
    const widthCanvas = items.length * widthPlot;

    let canvas = ReactDOM.findDOMNode(this.refs.canvas);

    canvas.width = widthCanvas;
    canvas.height = heightCanvas;
    let ctx = canvas.getContext('2d');
    const graphKey = ['max', 'avg'];

    graphKey.forEach( e => {
      ctx.beginPath();
      ctx.imageSmoothingEnabled = true;
      ctx.moveTo(0, heightCanvas);
      items.forEach( (el,i) => {
        if (el[e] == null) { el[e] = 0; }
        if (i === 0) {
          ctx.lineTo(0, heightCanvas - (el[e]/1.852)*2);
          ctx.lineTo(widthPlot*0.5, heightCanvas - (el[e]/1.852)*2);
          if (el[e] && el[e] > 0) {
            ctx.font = 'bold 14px Helvetica';
            ctx.fillStyle = getColor(el[e]);
            ctx.fillText(
              windUnit(el[e]),
              widthPlot*(i+0.5),
              heightCanvas - (el[e]/1.852)*2 - (e === 'avg' ? 4 : 12)
            );
          }
        } else if (i === items.length-1) {
          ctx.lineTo(widthCanvas, heightCanvas - (el[e]/1.852)*2);
          ctx.lineTo(widthCanvas, heightCanvas);
          if (el[e] && el[e] > 0) {
            ctx.font = 'bold 14px Helvetica';
            ctx.fillStyle = getColor(el[e]);
            ctx.fillText(
              windUnit(el[e]),
              widthPlot*(i+0.5),
              heightCanvas - (el[e]/1.852)*2 - (e === 'avg' ? 4 : 12)
            );
          }
        } else {
          el.prev = items[i+1];
          if (el.prev.max == null) { el.prev.max = 0; }
          if (el[e] && el[e] > 0) {
            ctx.font = 'bold 14px Helvetica';
            ctx.fillStyle = getColor(el[e]);
            ctx.shadowColor = 'rgba(0,0,0,0.45)';
            ctx.shadowBlur = 3;
            ctx.fillText(
              windUnit(el[e]),
              widthPlot*(i+0.5),
              heightCanvas - (el[e]/1.852)*2 - (e === 'avg' ? 4 : 12)
            );
          }
          ctx.bezierCurveTo(
            widthPlot*(i+1),
            heightCanvas - (el[e]/1.852)*2,
            widthPlot*(i+1),
            heightCanvas - (el.prev[e]/1.852)*2,
            widthPlot*(i+1.5),
            heightCanvas - (el.prev[e]/1.852)*2
          );
        }
      });
      if ( e === 'max') {
        const grd2 = ctx.createLinearGradient(0,heightCanvas,0,0);
        grd2.addColorStop(0, 'rgba(255,10,210,0.3)');
        grd2.addColorStop(0.8, 'rgba(255,10,210,0.6)');
        ctx.fillStyle = grd2;
        ctx.fill();
      } else {
        const grd = ctx.createLinearGradient(0,heightCanvas,0,0);
        grd.addColorStop(0, 'rgba(255,170,15,0.3)');
        grd.addColorStop(0.8, 'rgba(255,170,15,0.6)');
        ctx.fillStyle = grd;
        ctx.fill();
      }
    });

  }
  render() {
    return <canvas className="widget-wind-graph" ref="canvas" />;
  }
}

GraphWidget.propTypes = {
  detail: PropTypes.any,
  displayDetail: PropTypes.any
};

export default GraphWidget;
