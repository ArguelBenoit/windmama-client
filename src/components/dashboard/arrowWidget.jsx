import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '../../store/store.js';
import { getColor } from '../../filters';
import { typeOfActions } from '../../store/actions.js';


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
    let styleContainer = store.viewportWidth > 480 ? {
      width: this.props.height,
      height: this.props.height
    } : {
      width: '100%',
      height: 260
    };
    let styleSvg = store.viewportWidth > 480 ? {
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
    let itemNbr = 18;
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
        opacity: (i+1)*(itemNbr/1),
        transformOrigin: '120px 120px',
        transform: `rotate(${headingLevel * 22.5}deg)`
      };
      let styleG2 = {
        transformOrigin: '120px 120px',
        transform: `scale(${e.max * ratio - 0.03})`
      };
      let styleG3 = {
        transformOrigin: '120px 120px',
        transform: `scale(${e.avg * ratio - 0.03})`
      };
      return <g
        key={i}
        style={styleG}>
        {e.max ?
          <g style={styleG2}>
            <path
              fill="#000"
              d="M138.3,26.8c-5.9-1.2-12-1.8-18.3-1.8s-12.4,0.6-18.3,1.8l18.3,91.9L138.3,26.8z"
            />
          </g>
        : ''}
        <g style={styleG3}>
          <path
            fill={getColor(e.avg)}
            d="M138.3,26.8c-5.9-1.2-12-1.8-18.3-1.8s-12.4,0.6-18.3,1.8l18.3,91.9L138.3,26.8z"
          />
        </g>
      </g>;
    });

    return <div style={styleContainer}>
      <svg style={styleSvg} width="240" height="240" fill="#fff">
        {path}
        <path d="M117.4,20v-7.6h1.1l2.4,3.8c0.6,0.9,1,1.7,1.4,2.5l0,0c-0.1-1-0.1-1.9-0.1-3.1v-3.2h0.9V20h-1l-2.4-3.8
          c-0.5-0.8-1-1.7-1.4-2.5l0,0c0.1,1,0.1,1.9,0.1,3.1V20H117.4z"/>
        <path d="M13.1,123.6l-1.8-7h1l0.8,3.5c0.2,0.9,0.4,1.7,0.5,2.4h0c0.1-0.7,0.3-1.5,0.6-2.4l0.9-3.5h0.9l0.9,3.6
          c0.2,0.8,0.4,1.7,0.5,2.4h0c0.1-0.8,0.3-1.5,0.6-2.4l0.9-3.5h0.9l-2,7H17l-0.9-3.7c-0.2-0.9-0.4-1.6-0.5-2.3h0
          c-0.1,0.7-0.3,1.4-0.5,2.3l-1,3.7H13.1z"/>
        <path d="M227.5,120h-3v2.8h3.3v0.8h-4.3v-7.6h4.1v0.8h-3.1v2.4h3V120z"/>
        <path d="M117.6,226c0.5,0.3,1.1,0.5,1.9,0.5c1.1,0,1.7-0.6,1.7-1.4c0-0.8-0.4-1.2-1.5-1.6c-1.3-0.5-2.1-1.1-2.1-2.3
          c0-1.3,1-2.2,2.6-2.2c0.8,0,1.4,0.2,1.8,0.4l-0.3,0.8c-0.3-0.1-0.8-0.4-1.5-0.4c-1.1,0-1.5,0.7-1.5,1.2c0,0.8,0.5,1.1,1.6,1.6
          c1.4,0.5,2.1,1.2,2.1,2.4c0,1.2-0.9,2.3-2.8,2.3c-0.8,0-1.6-0.2-2.1-0.5L117.6,226z"/>
        <g style={{opacity: 0.5}}>
          <rect x="11.7" y="119.7" transform="matrix(0.1951 -0.9808 0.9808 0.1951 -21.1051 214.2834)" width="216.6" height="0.5"/>
          <rect x="119.7" y="11.7" transform="matrix(0.9808 -0.1951 0.1951 0.9808 -21.1051 25.7166)" width="0.5" height="216.6"/>
          <rect x="119.7" y="11.7" transform="matrix(0.8315 -0.5556 0.5556 0.8315 -46.4448 86.8921)" width="0.5" height="216.6"/>
          <rect x="119.7" y="11.7" transform="matrix(0.5556 -0.8315 0.8315 0.5556 -46.4448 153.1079)" width="0.5" height="216.6"/>
          <rect x="119.7" y="11.7" transform="matrix(0.1951 -0.9808 0.9808 0.1951 -21.1051 214.2834)" width="0.5" height="216.6"/>
          <rect x="11.7" y="119.7" transform="matrix(0.9808 -0.1951 0.1951 0.9808 -21.1051 25.7166)" width="216.6" height="0.5"/>
          <rect x="11.7" y="119.7" transform="matrix(0.8315 -0.5556 0.5556 0.8315 -46.4448 86.8921)" width="216.6" height="0.5"/>
          <rect x="11.7" y="119.7" transform="matrix(0.5556 -0.8315 0.8315 0.5556 -46.4448 153.1079)" width="216.6" height="0.5"/>
        </g>
        <path d="M120,0C53.8,0,0,53.8,0,120s53.8,120,120,120s120-53.8,120-120S186.2,0,120,0z M125.6,236.9l-5.6-5.6l-5.6,5.6
          C54.3,234.1,5.9,185.7,3.1,125.6l5.6-5.6l-5.6-5.6C5.9,54.3,54.3,5.9,114.4,3.1l5.6,5.6l5.6-5.6c60.1,2.8,108.5,51.2,111.3,111.3
          l-5.6,5.6l5.6,5.6C234.1,185.7,185.7,234.1,125.6,236.9z"/>
      </svg>
    </div>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number,
  detail: PropTypes.object
};

export default ArrowWidget;
