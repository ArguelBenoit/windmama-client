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
      transform: `scale(${this.props.height / 280 + 0.15})`  // 240 + 40 for keep border
    } : {
      marginLeft: ( store.viewportWidth - 240 - 20 ) / 2,
      marginTop: 10,
      transform: 'scale(1.1)'
    };

    let { items } = this.props.detail;
    let max = 0;
    let itemNbr = 18;
    items = items.slice(
      items.length - sliceLevel - itemNbr, items.length - sliceLevel
    );
    items.forEach( e => {
      if (e.avg > max)
        max = e.avg;
      if (e.max > max)
        max = e.max;
    });
    let ratio = 1 / max;
    let path = items.map( (e, i) => {
      let headingLevel = Math.round(e.heading / 20);
      let styleG = {
        opacity: 0.15 + ( i++ * (itemNbr/0.85) ),
        transformOrigin: '120px 120px',
        transform: `rotate(${headingLevel * 18}deg)`
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
              d="M135.4,21.2c-5-0.8-10.2-1.2-15.4-1.2s-10.4,0.4-15.4,1.2l15.4,97.2L135.4,21.2z"
              />
          </g>
        : ''}
        <g style={styleG3}>
          <path
            fill={getColor(e.avg)}
            d="M135.4,21.2c-5-0.8-10.2-1.2-15.4-1.2s-10.4,0.4-15.4,1.2l15.4,97.2L135.4,21.2z"
            />
        </g>
      </g>;
    });

    return <div style={styleContainer}>
      <svg style={styleSvg} width="240" height="240" fill="#fff">
        {path}
        <g style={{opacity: 0.8}}>
          <rect x="119.8" y="15" transform="matrix(0.9877 -0.1564 0.1564 0.9877 -17.2947 20.2495)" width="0.5" height="210"/>
          <rect x="119.8" y="15" transform="matrix(0.891 -0.454 0.454 0.891 -41.3996 67.5581)" width="0.5" height="210"/>
          <rect x="119.8" y="15" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -49.7056 120)" width="0.5" height="210"/>
          <rect x="119.8" y="15" transform="matrix(0.454 -0.891 0.891 0.454 -41.3996 172.4419)" width="0.5" height="210"/>
          <rect x="119.8" y="15" transform="matrix(0.1564 -0.9877 0.9877 0.1564 -17.2947 219.7505)" width="0.5" height="210"/>
          <rect x="15" y="119.8" transform="matrix(0.9877 -0.1564 0.1564 0.9877 -17.2947 20.2495)" width="210" height="0.5"/>
          <rect x="15" y="119.8" transform="matrix(0.891 -0.454 0.454 0.891 -41.3996 67.5581)" width="210" height="0.5"/>
          <rect x="15" y="119.8" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -49.7056 120)" width="210" height="0.5"/>
          <rect x="15" y="119.8" transform="matrix(0.454 -0.891 0.891 0.454 -41.3996 172.4419)" width="210" height="0.5"/>
          <rect x="15" y="119.8" transform="matrix(0.1564 -0.9877 0.9877 0.1564 -17.2947 219.7505)" width="210" height="0.5"/>
        </g>
        <path d="M117,20v-8.5h1.2l2.7,4.3c0.6,1,1.1,1.9,1.5,2.8l0,0c-0.1-1.1-0.1-2.2-0.1-3.5v-3.6h1V20h-1.1l-2.7-4.3
          c-0.6-0.9-1.2-1.9-1.6-2.8l0,0c0.1,1.1,0.1,2.1,0.1,3.5V20H117z"/>
        <path d="M12.4,124l-2-7.9h1.1l0.9,4c0.2,1,0.4,2,0.6,2.7h0c0.1-0.8,0.4-1.7,0.6-2.7l1-4h1.1l1,4c0.2,0.9,0.4,1.9,0.5,2.7h0
          c0.2-0.9,0.4-1.7,0.6-2.7l1-4h1l-2.2,7.9h-1.1l-1-4.1c-0.2-1-0.4-1.8-0.5-2.6h0c-0.1,0.8-0.3,1.6-0.6,2.6l-1.1,4.1H12.4z"/>
        <path d="M227.4,120h-3.3v3.1h3.7v0.9H223v-8.6h4.6v0.9h-3.5v2.7h3.3V120z"/>
        <path d="M117.3,227.8c0.5,0.3,1.3,0.6,2.1,0.6c1.2,0,1.9-0.6,1.9-1.5c0-0.8-0.5-1.3-1.7-1.8c-1.5-0.5-2.4-1.3-2.4-2.6
          c0-1.4,1.2-2.5,2.9-2.5c0.9,0,1.6,0.2,2,0.4l-0.3,1c-0.3-0.2-0.9-0.4-1.7-0.4c-1.2,0-1.7,0.7-1.7,1.4c0,0.8,0.5,1.3,1.8,1.7
          c1.5,0.6,2.3,1.3,2.3,2.7c0,1.4-1,2.6-3.2,2.6c-0.9,0-1.8-0.3-2.3-0.6L117.3,227.8z"/>
      </svg>
    </div>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number,
  detail: PropTypes.object
};

export default ArrowWidget;
