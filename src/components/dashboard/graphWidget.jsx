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
    let heightCanvas = 140;
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
    let { ratio } = this.props;
    const { widthPlot } = this;
    const widthCanvas = items.length * widthPlot;
    let heightCanvas = 140;

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
        ctx1.lineTo(0, heightCanvas - (el.max/1.852) * ratio);
        ctx1.lineTo(widthPlot*0.5, heightCanvas - (el.max/1.852) * ratio);
        if (el.max && el.max > 0) {
          ctx1.font = '14px Helvetica';
          ctx1.fillStyle = getColor(el.max);
          ctx1.fillText(
            windUnit(el.max),
            widthPlot*(i+0.5),
            heightCanvas - (el.max/1.852) * ratio - 12
          );
        }
      } else if (i === items.length-1) {
        ctx1.lineTo(widthCanvas, heightCanvas - (el.max/1.852) * ratio);
        ctx1.lineTo(widthCanvas, heightCanvas);
        if (el.max && el.max > 0) {
          ctx1.font = '14px Helvetica';
          ctx1.fillStyle = getColor(el.max);
          ctx1.fillText(
            windUnit(el.max),
            widthPlot*(i+0.5),
            heightCanvas - (el.max/1.852) * ratio - 12
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
            heightCanvas - (el.max/1.852) * ratio - 12
          );
        }
        ctx1.bezierCurveTo(
          widthPlot*(i+1),
          heightCanvas - (el.max/1.852) * ratio,
          widthPlot*(i+1),
          heightCanvas - (el.prev.max/1.852) * ratio,
          widthPlot*(i+1.5),
          heightCanvas - (el.prev.max/1.852) * ratio
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
        ctx2.lineTo(0, heightCanvas - (el.avg/1.852) * ratio);
        ctx2.lineTo(widthPlot*0.5, heightCanvas - (el.avg/1.852) * ratio);
        if (el.avg && el.avg > 0) {
          ctx2.font = '14px Helvetica';
          ctx2.fillStyle = getColor(el.avg);
          ctx2.fillText(
            windUnit(el.avg),
            widthPlot*(i+0.5),
            heightCanvas - (el.avg/1.852) * ratio - 4
          );
        }
      } else if (i === items.length-1) {
        ctx2.lineTo(widthCanvas, heightCanvas - (el.avg/1.852) * ratio);
        ctx2.lineTo(widthCanvas, heightCanvas);
        if (el.avg && el.avg > 0) {
          ctx2.font = '14px Helvetica';
          ctx2.fillStyle = getColor(el.avg);
          ctx2.fillText(
            windUnit(el.avg),
            widthPlot*(i+0.5),
            heightCanvas - (el.avg/1.852) * ratio - 4
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
            heightCanvas - (el.avg/1.852) * ratio - 4
          );
        }
        ctx2.bezierCurveTo(
          widthPlot*(i+1),
          heightCanvas - (el.avg/1.852) * ratio,
          widthPlot*(i+1),
          heightCanvas - (el.prev.avg/1.852) * ratio,
          widthPlot*(i+1.5),
          heightCanvas - (el.prev.avg/1.852) * ratio
        );
      }
    });
    const grd = ctx2.createLinearGradient(0,heightCanvas,0,0);
    let arrayColor = [
      '#fff',
      'rgb(81, 249, 189)',
      'rgb(255, 214, 6)',
      'rgb(255, 19, 167)',
      'rgb(233, 11, 255)',
      'rgb(126, 53, 255)'
    ];
    let { max } = this.props;
    let round = Math.round(max/10) + 1;
    for(let i = 0; i < round; i++) {
      if (i > 5) grd.addColorStop( 1, 'rgb(126, 53, 255)');
      else grd.addColorStop( i * ( 1 / round ), arrayColor[i]);
    }

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
  ratio: PropTypes.number,
  max: PropTypes.number
};

export default GraphWidget;
