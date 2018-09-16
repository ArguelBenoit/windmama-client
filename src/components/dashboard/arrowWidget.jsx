import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '../../store/store.js';
import { getColor } from '../../filters';
import { typeOfActions } from '../../store/actions.js';
import WindUnit from '../windUnit.jsx';


class ArrowWidget extends Component {
  constructor(props) {
    super(props);
    this.changeSliceLevel = this.changeSliceLevel.bind(this);
    this.state = {
      sliceLevel: 0
    };
  }
  componentDidMount() {
    store.on(typeOfActions.SCROLL_GRAPH_OBSERVATION, this.changeSliceLevel);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.SCROLL_GRAPH_OBSERVATION, this.changeSliceLevel);
  }
  changeSliceLevel() {
    this.setState({ sliceLevel: store.scrollGraphObservation });
  }
  render() {
    let { sliceLevel } = this.state;
    let styleContainer = store.viewportWidth > 700 ? {
      width: this.props.height,
      height: this.props.height
    } : {
      width: '100%',
      height: 260
    };
    let styleSvg = store.viewportWidth > 700 ? {
      marginLeft: ( this.props.height - 240 ) / 2,
      marginTop: ( this.props.height - 240 ) / 2,
      transform: `scale(${this.props.height / 280 + 0.1})`  // 240 + 40 for keep border
    } : {
      marginLeft: ( store.viewportWidth - 240 - 20 ) / 2,
      marginTop: 10,
      transform: 'scale(1)'
    };

    let { items } = this.props.detail;
    let max = 0;
    let itemNbr = 25;
    if (items.length - sliceLevel < itemNbr) {
      items = items.slice(0, items.length - sliceLevel);
    } else {
      items = items.slice(
        items.length - sliceLevel - itemNbr, items.length - sliceLevel
      );
    }
    items.forEach( e => {
      if (e.avg > max)
        max = e.avg;
      if (e.max > max)
        max = e.max;
    });
    let ratio = 1 / max;
    let path = items.map( (e, i) => {
      let headingLevel = Math.round(e.heading / 22.5);
      let styleG = {
        opacity: (i+1)*(1/itemNbr),
        transformOrigin: '120px 120px',
        transform: `rotate(${headingLevel * 22.5}deg)`
      };
      let styleG2 = {
        transformOrigin: '120px 120px',
        transform: `scale(${e.max * ratio})`
      };
      let styleG3 = {
        transformOrigin: '120px 120px',
        transform: `scale(${e.avg * ratio})`
      };
      return <g
        key={i}
        style={styleG}>
        {e.max ?
          <g style={styleG2}>
            <linearGradient id="grad1" x1="50%" y1="20%" x2="50%" y2="100%">
              <stop offset="0%" style={{stopColor: getColor(e.max)}} />
              <stop offset="100%" style={{stopColor: '#000'}} />
            </linearGradient >
            <path
              fill="url(#grad1)"
              d="M139.7,20.9c-6.4-1.3-13-1.9-19.7-1.9s-13.3,0.7-19.7,1.9L120,120L139.7,20.9z"
            />
          </g>
        : ''}
        <g style={styleG3}>
          <path
            fill={getColor(e.avg)}
            d="M139.7,20.9c-6.4-1.3-13-1.9-19.7-1.9s-13.3,0.7-19.7,1.9L120,120L139.7,20.9z"
          />
        </g>
      </g>;
    });

    return <div style={styleContainer}>
      <svg style={styleSvg} width="240" height="240" fill="#fff">
        <path d="M117.4,10V2.4h1.1l2.4,3.8c0.6,0.9,1,1.7,1.4,2.5l0,0c-0.1-1-0.1-1.9-0.1-3.1V2.4h0.9V10h-1l-2.4-3.8
          c-0.5-0.8-1-1.7-1.4-2.5l0,0c0.1,1,0.1,1.9,0.1,3.1V10H117.4z"/>
        <path d="M3.1,123.6l-1.8-7h1l0.8,3.5c0.2,0.9,0.4,1.7,0.5,2.4h0c0.1-0.7,0.3-1.5,0.6-2.4l0.9-3.5h0.9l0.9,3.6
          c0.2,0.8,0.4,1.7,0.5,2.4h0c0.1-0.8,0.3-1.5,0.6-2.4l0.9-3.5h0.9l-2,7H7l-0.9-3.7c-0.2-0.9-0.4-1.6-0.5-2.3h0
          c-0.1,0.7-0.3,1.4-0.5,2.3l-1,3.7H3.1z"/>
        <path d="M235.5,120h-3v2.8h3.3v0.8h-4.3v-7.6h4.1v0.8h-3.1v2.4h3V120z"/>
        <path d="M117.6,237c0.5,0.3,1.1,0.5,1.9,0.5c1.1,0,1.7-0.6,1.7-1.4c0-0.8-0.4-1.2-1.5-1.6c-1.3-0.5-2.1-1.1-2.1-2.3
          c0-1.3,1-2.2,2.6-2.2c0.8,0,1.4,0.2,1.8,0.4l-0.3,0.8c-0.3-0.1-0.8-0.4-1.5-0.4c-1.1,0-1.5,0.7-1.5,1.2c0,0.8,0.5,1.1,1.6,1.6
          c1.4,0.5,2.1,1.2,2.1,2.4c0,1.2-0.9,2.3-2.8,2.3c-0.8,0-1.6-0.2-2.1-0.5L117.6,237z"/>
        <g fill="none" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2">
          <circle cx="120" cy="120" r="40"/>
          <circle cx="120" cy="120" r="80"/>
        </g>
        <g fill="none" stroke="#ccc" strokeWidth="0.5">
          <circle cx="120" cy="120" r="20"/>
          <circle cx="120" cy="120" r="60"/>
          <circle cx="120" cy="120" r="100"/>
        </g>
        <g fill="none" stroke="#ccc" strokeWidth="1">
          <line x1="12.5" y1="120" x2="227.5" y2="120"/>
          <line x1="120" y1="227.5" x2="120" y2="12.5"/>
        </g>
        {path}
        <g fontSize="7" strock="#000">
          <text x="122" y="18"><WindUnit value={max} /></text>
          <text x="122" y="38"><WindUnit value={max*0.8} /></text>
          <text x="122" y="58"><WindUnit value={max*0.6} /></text>
          <text x="122" y="78"><WindUnit value={max*0.4} /></text>
          <text x="122" y="98"><WindUnit value={max*0.2} /></text>
          <text x="122" y="118">00</text>
        </g>
      </svg>
    </div>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number,
  detail: PropTypes.object
};

export default ArrowWidget;
