import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GraphWidget from './graphWidget.jsx';
import GraphLegend from './graphLegend.jsx';
import ArrayWidget from './arrayWidget.jsx';
import ArrayLegend from './arrayLegend.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';


class ContainerGraphArrayWidget extends Component {
  constructor(props) {
    super(props);
    this.scrollToRight = this.scrollToRight.bind(this);
    this.mainUpdate = this.mainUpdate.bind(this);
  }
  componentDidMount() {
    this.scrollToRight();
    store.on(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
  }
  shouldComponentUpdate(prevProps) {
    if (prevProps.detail !== this.props.detail) {
      return true;
    } else if (
      store.idUpdate === prevProps.detail[0].id
    ) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.displayDetail !== prevProps.displayDetail)
      this.scrollToRight(); // if new detail only scroll to right.
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.CHANGE_SETTINGS, this.mainUpdate);
  }
  mainUpdate() {
    this.forceUpdate();
  }
  scrollToRight() {
    let scrollContainer = ReactDOM.findDOMNode(this.container).childNodes[0];
    scrollContainer.scrollLeft = scrollContainer.scrollWidth;
  }
  render() {
    let { detail } = this.props;
    let lastData = detail[detail.length - 1],
        keys = Object.keys(lastData),
        allKeys = [
          'date',
          'heading',
          'max',
          'avg',
          'min',
          'temperature',
          'rain',
          'humidity',
          'pressure'
        ],
        presentsKeys = [];

    allKeys.forEach( el => {
      if (keys.indexOf(el) >= 0 && lastData[el] !== 'nc')
        presentsKeys.push(el);
    });

    const style = {
      display: 'flex'
    };
    return <div className="widget-wind-array" style={style} >
      <div className="legend">
        <GraphLegend />
        <ArrayLegend presentsKeys={presentsKeys} />
      </div>
      <Scrollbars ref={el => { this.container = el; }} style={{ height: 200 + 30 * presentsKeys.length }}>
        <GraphWidget detail={detail} />
        <ArrayWidget presentsKeys={presentsKeys} detail={detail} />
      </Scrollbars>
    </div>;
  }
}

ContainerGraphArrayWidget.propTypes = {
  detail: PropTypes.any,
  displayDetail: PropTypes.any
};

export default ContainerGraphArrayWidget;
