import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '../../store/store.js';



class ArrowWidget extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    let style = {
      width: store.viewportWidth > 480 ? this.props.height : '100%',
      height:  store.viewportWidth > 480 ? this.props.height : 200
    };
    return <div style={style}/>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number
};

export default ArrowWidget;
