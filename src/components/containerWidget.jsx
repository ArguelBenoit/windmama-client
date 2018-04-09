import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoWidget from './infoWidget.jsx';
import ContainerGraphArrayWidget from './containerGraphArrayWidget.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import { Actions, typeOfActions } from '../store/actions.js';
import store from '../store/store.js';
import request from 'request';
import './css/containerWidget.css';


class ContainerWidget extends Component {
  constructor(props) {
    super(props);
    this.request = this.request.bind(this);
    this.updateDetail = this.updateDetail.bind(this);
    this.loadPageAtStationLevel = this.loadPageAtStationLevel.bind(this);
    this.state = {
      onePlace: false,
      oneDetail: false
    };
  }
  componentDidMount() {
    this.request(this.props.match.params.stationId);
    store.on(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.on(typeOfActions.DATA_RECEIVED, this.loadPageAtStationLevel);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname)
      this.request(nextProps.match.params.stationId);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.removeListener(typeOfActions.DATA_RECEIVED, this.loadPageAtStationLevel);
  }
  loadPageAtStationLevel() {
    this.request(this.props.match.params.stationId);
  }
  request(id) {
    if (Object.keys(store.place).length !== 0) {
      let url = 'http://windmama.fr:81/spot?station=' + id;
      request(url, (z, x, a) => {
        a = JSON.parse(a);
        var tempA = [];
        a.forEach(e => {
          tempA.push(e);
        });
        Actions.loadActivity(false);
        this.setState({
          onePlace: store.place[id],
          oneDetail: tempA.reverse()
        });
      });
    }
  }
  updateDetail() {
    const displayDetail = this.props.match.params.stationId;
    let { oneDetail } = this.state;
    let { idUpdate, detail } = store;
    if (idUpdate === displayDetail) {
      oneDetail.push(detail[idUpdate][0]);
      this.setState({ oneDetail });
    }
  }
  render() {
    const displayDetail = this.props.match.params.stationId;
    const {
      rightActive,
      leftActive,
      mobile,
      viewportWidth,
      viewportHeight
    } = store;
    const { oneDetail, onePlace } = this.state;

    let content = oneDetail ? <div>
      <InfoWidget detail={oneDetail} place={onePlace} displayDetail={displayDetail} />
      <ContainerGraphArrayWidget detail={oneDetail} displayDetail={displayDetail} />
    </div>: '';

    let widthContainer;
    let marginLeftContainer;
    if (!leftActive && !rightActive && !mobile) {
      widthContainer = viewportWidth;
      marginLeftContainer = 0;
    } else if (leftActive && !mobile) {
      widthContainer = (viewportWidth - 260) + 'px';
      marginLeftContainer = 260;
    } else if (rightActive && !mobile) {
      widthContainer = (viewportWidth - 260) + 'px';
      marginLeftContainer = 0;
    }

    var heightCoverWidget = {
      height: viewportHeight - 60 + 'px',
      width: widthContainer,
      marginLeft: marginLeftContainer
    };

    return <div id="cover-widgets" style={heightCoverWidget} className={'active'}>
      <Scrollbars style={{height: ( viewportHeight - 60 ) + 'px'}}>
        <div className="container-widgets" id="container-widgets" >
          {displayDetail ? content : ''}
        </div>
      </Scrollbars>
    </div>;
  }
}

ContainerWidget.propTypes = {
  leftActive: PropTypes.bool,
  rightActive: PropTypes.bool,
  displayDetail: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object
};

export default ContainerWidget;
