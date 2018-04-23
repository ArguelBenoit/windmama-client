import React, { Component } from 'react';
import store from '../store/store.js';
import { typeOfActions } from '../store/actions.js';
import * as PIXI from 'pixi.js';
import { getColor } from '../filters';
import moment from 'moment';
import PropTypes from 'prop-types';
import WindUnit from './windUnit.jsx';
import './css/tooltip.css';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.updateIdHover = this.updateIdHover.bind(this);
    this.state = {
      idHover: false
    };
  }
  componentDidMount() {
    store.on(typeOfActions.HOVER_ID, this.updateIdHover);
    this.app = new PIXI.Application({
      width: 260,
      height: 0,
      transparent: true,
      antialias: true,
      view: this.refs.graph,
      resolution: 1.6
    });
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.HOVER_ID, this.updateIdHover);
  }
  updateIdHover() {
    this.setState({idHover: store.hoverId});
  }
  render() {
    const { idHover } = this.state;
    let { detail } = store;
    let info;

    if (idHover) {

      const oneDetail = detail[idHover];
      const hour = store.settings.universalTime
        ? moment(oneDetail.date, moment.ISO_8601).utcOffset(+0).format('HH:mm')
        : moment(oneDetail.date, moment.ISO_8601).format('HH:mm');

      info = <span>
         {hour + ' - '}
         <WindUnit value={oneDetail.avg}/>
         {oneDetail.max !== 0 && oneDetail.max !== '--'
           ? <span>
               {'/' }
               <WindUnit value={oneDetail.max}/>
             </span>
           : ''
         }
         {' ' + store.settings.windUnit}
         {' - ' + oneDetail.heading + '°'}
       </span>;

      // this.app.stage.children[0] ? this.app.stage.children = [] : '' ;
      if (this.app.stage.children[0]) {
        this.app.stage.children = [];
      }
      let graph = new PIXI.Graphics();

      const max = oneDetail.max !== '--' ? oneDetail.max*2 : 0;
      const avg = oneDetail.avg*2;
      const width = 260;
      const height = max < avg
        ? avg+24
        : max+24;
      this.app.renderer.resize(260, height);
      const avgColor = getColor(oneDetail.avg, true);
      const maxColor = getColor(oneDetail.max, true);

      graph.beginFill(0x000000, 0.85);
      graph.drawRect(0, 0, width, height);
      graph.endFill();

      graph.moveTo(0, height);
      graph.lineStyle(2, avgColor, 1.0);
      graph.bezierCurveTo(width*0.25, height, width*0.25, height-avg, width*0.5, height-avg);
      graph.bezierCurveTo(width*0.75, height-avg, width*0.75, height, width, height);

      graph.lineStyle(3, avgColor);
      graph.beginFill(0x000000);
      graph.drawCircle(width*0.5, height-avg, 4);
      graph.endFill();

      if (max !== 0) {
        graph.moveTo(0, height);
        graph.lineStyle(2, maxColor, 1.0);
        graph.bezierCurveTo(width*0.25, height, width*0.25, height-max, width*0.5, height-max);
        graph.bezierCurveTo(width*0.75, height-max, width*0.75, height, width, height);

        graph.lineStyle(3, maxColor);
        graph.beginFill(0x000000);
        graph.drawCircle(width*0.5, height-max, 4);
        graph.endFill();
      }

      this.app.stage.addChild(graph);

    } else {
      info = '...';
    }

    const style = {
      right: this.props.rightActive ? 270 : 10
    };
    return <div id="tooltip" style={style}>
      <canvas ref="graph" className="graph-tooltip"/>
      <div className="info-tooltip">
        {info}
      </div>
    </div>;
  }
}

Tooltip.propTypes = {
  rightActive: PropTypes.bool
};

export default Tooltip;
