import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoWidget from './infoWidget.jsx';
import ContainerGraphArrayWidget from './containerGraphArrayWidget.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import { Actions, typeOfActions } from '../store/actions.js';
import store from '../store/store.js';
import $ from 'jquery';
import './css/containerWidget.css';


class ContainerWidget extends Component {
  constructor(props) {
    super(props);
    this.request = this.request.bind(this);
    this.updateDetail = this.updateDetail.bind(this);
    this.state = {
      onePlace: false,
      oneDetail: false
    };
  }
  componentDidMount() {
    this.request(this.props.displayDetail);
    store.on(typeOfActions.UPDATE_DETAIL, this.updateDetail);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.displayDetail !== nextProps.displayDetail)
      this.request(nextProps.displayDetail);
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.UPDATE_DETAIL, this.updateDetail);
  }
  request(id) {
    let _this = this;
    $.ajax({
      url: store.environment === 'web'
        ? window.location.protocol + '//' + window.location.hostname + '/spot/?' + id // if protocol http or https we are in web environement
        : 'http://windmama.fr/spot/?' + id, // else we are app environement
      type: 'POST',
      async: true,
      success(a) {
        a = JSON.parse(a);
        var tempA = [];
        a.forEach(e => {
          tempA.push(e);
        });
        Actions.loadActivity();
        _this.setState({
          onePlace: store.place[id],
          oneDetail: tempA.reverse()
        });
      }
    });
  }
  updateDetail() {
    const { displayDetail } = this.props;
    let { oneDetail } = this.state;
    let { idUpdate, detail } = store;
    if (idUpdate === displayDetail) {
      oneDetail.push(detail[idUpdate][0]);
      this.setState({ oneDetail });
    }
  }
  render() {
    const { displayDetail, rightActive, leftActive } = this.props;
    const { mobile, viewportWidth, viewportHeight } = store;
    const { oneDetail, onePlace } = this.state;

    let content = oneDetail ? <div>
      <InfoWidget detail={oneDetail} place={onePlace} />
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
  displayDetail: PropTypes.any
};

export default ContainerWidget;
