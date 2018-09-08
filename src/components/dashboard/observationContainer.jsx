import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GraphWidget from './graphWidget.jsx';
import ArrayWidget from './arrayWidget.jsx';
import ArrayLegend from './arrayLegend.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import store from '../../store/store.js';
import { typeOfActions } from '../../store/actions.js';
import ArrowWidget from './arrowWidget.jsx';



class ObservationContainer extends Component {
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
    } else if (store.idUpdate === prevProps.detail.name) {
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
    let lastData = detail.items[detail.items.length - 1],
        keys = Object.keys(lastData),
        allKeys = [
          'date',
          'heading',
          'max',
          'avg',
          'min',
          'rain',
          'humidity',
          'temperature',
          'pressure'
        ],
        presentsKeys = [];

    allKeys.forEach( el => {
      if (keys.indexOf(el) >= 0)
        presentsKeys.push(el);
    });

    // --
    let max = 0;
    detail.items.forEach( e => {
      if (e.avg > max)
        max = e.avg;
      if (e.max > max)
        max = e.max;
    });
    max = (max/1.852);
    let ratio = 110 / max;
    //--

    return <div className="widget-wind-array">
      <div className="containerArrowWidget">
        <ArrowWidget detail={detail} height={140 + ( 30 * presentsKeys.length )} />
      </div>
      <div className="containerWindObservation">
        <Scrollbars ref={el => { this.container = el; }} style={{ height: 140 + ( 30 * presentsKeys.length ) }}>
          <GraphWidget detail={detail} ratio={ratio} max={max}/>
          <ArrayWidget presentsKeys={presentsKeys} detail={detail} />
        </Scrollbars>
        <ArrayLegend presentsKeys={presentsKeys} margin={- ( 30 * presentsKeys.length ) }/>
      </div>
    </div>;
  }
}

ObservationContainer.propTypes = {
  detail: PropTypes.any,
  displayDetail: PropTypes.any
};

export default ObservationContainer;
