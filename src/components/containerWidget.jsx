import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoWidget from './infoWidget.jsx';
import ContainerGraphArrayWidget from './containerGraphArrayWidget.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import { Actions, typeOfActions } from '../store/actions.js';
import store from '../store/store.js';
import request from 'request';
import './css/containerWidget.css';


const jsonParsePromise = json => {
  return new Promise((resolve, reject) => {
    try {
      let obj = JSON.parse(json);
      resolve(obj);
    } catch(err) {
      reject(err);
    }
  });
};

class ContainerWidget extends Component {
  constructor(props) {
    super(props);
    this.request = this.request.bind(this);
    this.updateDetail = this.updateDetail.bind(this);
    this.loadPageAtStationLevel = this.loadPageAtStationLevel.bind(this);
    this.state = {
      detail: null
    };
  }
  componentDidMount() {
    let { type, id } = this.props.match.params;
    this.request(type, id);
    store.on(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.on(typeOfActions.DATA_RECEIVED, this.loadPageAtStationLevel);
  }
  // componentWillReceiveProps(nextProps) {
  //   let { type, id } = nextProps.match.params;
  //   if (this.props.location.pathname !== nextProps.location.pathname) {
  //     this.request(type, id);
  //   }
  // }
  componentWillUnmount() {
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateDetail);
    store.removeListener(typeOfActions.DATA_RECEIVED, this.loadPageAtStationLevel);
  }
  loadPageAtStationLevel() {
    this.request(this.props.match.params.stationId);
  }
  request(type, id) {
    let url = `http://${window.location.hostname}:81/v2/wind-observation/by-name/${type}/${id}/all`;
    request(url, (z, x, a) => {
      jsonParsePromise(a).then( value => {
        Actions.loadActivity(false);
        this.setState({
          detail: value
        });
      }).catch( () => {
        const txt = `Patatra... This ${type} station does not exist.`;
        if(!alert(txt)) {
          this.props.history.push('/');
          Actions.loadActivity(false);
        }
      });
    });
  }
  updateDetail() {
    const displayDetail = this.props.match.params.stationId;
    let { oneDetail } = this.state;
    let { idUpdate, detail } = store;
    if (idUpdate === displayDetail) {
      oneDetail.push(detail[idUpdate]);
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
  location: PropTypes.object,
  history: PropTypes.object
};

export default ContainerWidget;
