import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { getColor, windUnit } from '../../filters';

class GraphWidget extends Component {
  constructor(props) {
    super(props);
    this.widthPlot = 50;
  }
  componentDidMount() {
    this.canvasCreator();
  }
  componentDidUpdate() {
    this.canvasCreator();
  }
  clearCanvas() {
    let heightCanvas = this.props.maxSize;
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    let ctx2 = canvas.getContext('2d');
    let ctx1 = canvas.getContext('2d');
    ctx2.clearRect(
      0,
      0,
      heightCanvas,
      361 * this.widthPlot
    );
    ctx1.clearRect(
      0,
      0,
      heightCanvas,
      361 * this.widthPlot
    );
  }
  canvasCreator() {
    let { items } = this.props.detail;
    const { widthPlot } = this;
    const widthCanvas = items.length * widthPlot;
    let heightCanvas = this.props.maxSize;

    let canvas = ReactDOM.findDOMNode(this.refs.canvas);

    canvas.width = widthCanvas;
    canvas.height = heightCanvas;

    let ctx2 = canvas.getContext('2d');
    let ctx1 = canvas.getContext('2d');

    ctx2.imageSmoothingEnabled= true;
    ctx2.mozImageSmoothingEnabled = true;
    ctx1.imageSmoothingEnabled= true;
    ctx1.mozImageSmoothingEnabled = true;

    ctx1.beginPath();
    ctx1.moveTo(0, heightCanvas);
    items.forEach( (el,i) => {
      if (el.max == null) { el.max = 0; }
      if (i === 0) {
        ctx1.lineTo(0, heightCanvas - (el.max/1.852) * 3);
        ctx1.lineTo(widthPlot*0.5, heightCanvas - (el.max/1.852) * 3);
        if (el.max && el.max > 0) {
          ctx1.font = '14px Helvetica';
          ctx1.fillStyle = getColor(el.max);
          ctx1.fillText(
            windUnit(el.max),
            widthPlot*(i+0.5),
            heightCanvas - (el.max/1.852) * 3 - 12
          );
        }
      } else if (i === items.length-1) {
        ctx1.lineTo(widthCanvas, heightCanvas - (el.max/1.852) * 3);
        ctx1.lineTo(widthCanvas, heightCanvas);
        if (el.max && el.max > 0) {
          ctx1.font = '14px Helvetica';
          ctx1.fillStyle = getColor(el.max);
          ctx1.fillText(
            windUnit(el.max),
            widthPlot*(i+0.5),
            heightCanvas - (el.max/1.852) * 3 - 12
          );
        }
      } else {
        el.prev = items[i+1];
        if (el.prev.max == null) { el.prev.max = 0; }
        if (el.max && el.max > 0) {
          ctx1.font = '14px Helvetica';
          ctx1.fillStyle = getColor(el.max);
          ctx1.fillText(
            windUnit(el.max),
            widthPlot*(i+0.5),
            heightCanvas - (el.max/1.852) * 3 - 12
          );
        }
        ctx1.bezierCurveTo(
          widthPlot*(i+1),
          heightCanvas - (el.max/1.852) * 3,
          widthPlot*(i+1),
          heightCanvas - (el.prev.max/1.852) * 3,
          widthPlot*(i+1.5),
          heightCanvas - (el.prev.max/1.852) * 3
        );
      }
    });
    ctx1.fillStyle = 'rgba(0,0,0,0.8)';
    ctx1.fill();


    ctx2.beginPath();
    ctx2.moveTo(0, heightCanvas);
    items.forEach( (el,i) => {
      if (el.avg == null) { el.avg = 0; }
      if (i === 0) {
        ctx2.lineTo(0, heightCanvas - (el.avg/1.852) * 3);
        ctx2.lineTo(widthPlot*0.5, heightCanvas - (el.avg/1.852) * 3);
        if (el.avg && el.avg > 0) {
          ctx2.font = '14px Helvetica';
          ctx2.fillStyle = getColor(el.avg);
          ctx2.fillText(
            windUnit(el.avg),
            widthPlot*(i+0.5),
            heightCanvas - (el.avg/1.852) * 3 - 4
          );
        }
      } else if (i === items.length-1) {
        ctx2.lineTo(widthCanvas, heightCanvas - (el.avg/1.852) * 3);
        ctx2.lineTo(widthCanvas, heightCanvas);
        if (el.avg && el.avg > 0) {
          ctx2.font = '14px Helvetica';
          ctx2.fillStyle = getColor(el.avg);
          ctx2.fillText(
            windUnit(el.avg),
            widthPlot*(i+0.5),
            heightCanvas - (el.avg/1.852) * 3 - 4
          );
        }
      } else {
        el.prev = items[i+1];
        if (el.prev.max == null) { el.prev.max = 0; }
        if (el.avg && el.avg > 0) {
          ctx2.font = '14px Helvetica';
          ctx2.fillStyle = getColor(el.avg);
          ctx2.fillText(
            windUnit(el.avg),
            widthPlot*(i+0.5),
            heightCanvas - (el.avg/1.852) * 3 - 4
          );
        }
        ctx2.bezierCurveTo(
          widthPlot*(i+1),
          heightCanvas - (el.avg/1.852) * 3,
          widthPlot*(i+1),
          heightCanvas - (el.prev.avg/1.852) * 3,
          widthPlot*(i+1.5),
          heightCanvas - (el.prev.avg/1.852) * 3
        );
      }
    });
    const grd = ctx2.createLinearGradient(0,heightCanvas,0,0);
    grd.addColorStop(0, '#fff');
    grd.addColorStop(0.2, 'rgb(81, 249, 189)');
    grd.addColorStop(0.4, 'rgb(255, 214, 6)');
    grd.addColorStop(0.6, 'rgb(255, 19, 167)');
    grd.addColorStop(0.8, 'rgb(233, 11, 255)');
    grd.addColorStop(1, 'rgb(126, 53, 255)');
    ctx2.fillStyle = grd;
    ctx2.fill();

  }
  render() {
    return <canvas className="widget-wind-graph" ref="canvas" />;
  }
}

GraphWidget.propTypes = {
  detail: PropTypes.any,
  displayDetail: PropTypes.any,
  maxSize: PropTypes.number
};

export default GraphWidget;
