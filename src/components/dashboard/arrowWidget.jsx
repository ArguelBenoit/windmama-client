import React, { Component } from 'react';
import PropTypes from 'prop-types';



class ArrowWidget extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    let style = {
      width: this.props.height,
      height: this.props.height,
      background: 'rgba(60,60,60,0.5)'
    };
    return <div style={style}/>;
  }
}

ArrowWidget.propTypes = {
  height: PropTypes.number
};

export default ArrowWidget;
