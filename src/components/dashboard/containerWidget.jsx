import React, { Component } from 'react';
import InfoWidget from './infoWidget.jsx';
import ObservationContainer from './observationContainer.jsx';
import PropTypes from 'prop-types';

class ContainerWidget extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      leftActive,
      rightActive
    } = this.props;
    if (leftActive !== nextProps.leftActive || rightActive !== nextProps.rightActive)
      return false;
    return true;
  }
  render() {
    const {
      detail,
      displayDetail,
      width,
      height
    } = this.props;

    let propsObsContainer = {
      detail,
      viewport: {
        width,
        height
      },
      displayDetail
    };
    return <div>
      <InfoWidget detail={detail} displayDetail={displayDetail} />
      <ObservationContainer {...propsObsContainer} />
    </div>;
  }
}


ContainerWidget.propTypes = {
  leftActive: PropTypes.bool,
  rightActive: PropTypes.bool,
  displayDetail: PropTypes.any,
  detail: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
};

export default ContainerWidget;
