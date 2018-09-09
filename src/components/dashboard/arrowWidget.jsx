import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '../../store/store.js';



class ArrowWidget extends Component {
  // constructor(props) {
  //   super(props);
  //   this.zoomWhile = this.zoomWhile.bind(this);
  // }
  render() {
    // console.log('rerender');
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
      transform: `scale(${this.props.height / 280})`  // 240 + 40 for keep border
    } : {
      marginLeft: ( store.viewportWidth - 240 - 20 ) / 2,
      marginTop: 10
    };
    return <div style={styleContainer}>
      <svg ref={svg => this.svg = svg} style={styleSvg} width="240" height="240" fill="#fff">
        <polygon className="st0" points="113.9,18 121,25.1 128.1,18 "/>
        <path d="M114.1,21.7l-2.8-2.8C62.6,23,23.6,61.8,19,110.3l2.8,2.8C25.1,64,64.8,24.6,114.1,21.7z"/>
        <path d="M21.7,126.9l-2.8,2.8c4.6,48.6,43.6,87.3,92.3,91.5l2.8-2.8C64.8,215.4,25.1,176,21.7,126.9z"/>
        <path d="M130.6,19l-2.8,2.8c48.4,3.8,87.1,42.8,90.5,91.3l2.8-2.8C216.5,62.4,178.4,24,130.6,19z"/>
        <path d="M127.8,218.2l2.8,2.8c47.9-5,85.9-43.3,90.5-91.3l-2.8-2.8C214.9,175.4,176.2,214.4,127.8,218.2z"/>
        <polygon points="127.3,221.2 124.5,218.4 121,214.9 117.5,218.5 114.6,221.4 113.9,222 128.1,222 "/>
        <polygon points="221.3,113.6 218.4,116.5 214.9,120 218.4,123.5 221.3,126.4 222,127.1 222,112.9 "/>
        <polygon points="21.6,116.5 18.7,113.6 18,112.9 18,127.1 18.7,126.4 21.6,123.5 25.1,120 "/>
        <text transform="matrix(1 0 0 1 114.5918 14.1694)">N</text>
        <text transform="matrix(1 0 0 1 0.5918 126.1694)">W</text>
        <text transform="matrix(1 0 0 1 224.5918 126.1694)">E</text>
        <text transform="matrix(1 0 0 1 116.5918 238.1694)">S</text>
      </svg>
    </div>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number
};

export default ArrowWidget;
