import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getHumidityColor,
  getColorTemp,
  getColor
} from '../../filters';
import moment from 'moment';
import HeadingUnit from '../headingUnit.jsx';
import WindUnit from '../windUnit.jsx';
import TempUnit from '../tempUnit.jsx';
import RainUnit from '../rainUnit.jsx';
import store from '../../store/store.js';



class ArrayWidget extends Component {
  constructor(props) {
    super(props);
    this.dataFilters = this.dataFilters.bind(this);
  }
  dataFilters(data, type, i) {
    const rgbaNc = 'rgba(255,255,255,0.3)';

    switch (type) {

      case 'date':
        var dateProps = {
          style: {
            background: 'rgba(100,100,100,0.35)'
          },
          className: 'hour',
          key: i
        };
        return <td {...dateProps}>
          <div style={{width: 50}}>
            { data == null
              ? '--'
              : (store.settings.universalTime
                  ? moment(data.date, moment.ISO_8601).utcOffset(+0).format('HH:mm')
                  : moment(data.date, moment.ISO_8601).format('HH:mm')
              )
            }
          </div>
        </td>;

      case 'heading':
        var headingProps = {
          className: 'heading',
          key: i
        };
        return <td {...headingProps}>
          <HeadingUnit heading={data.heading} max={data.avg} />
        </td>;

      case 'max':
        var styleMax = {
          background: data.max == null
            ? '#eee'
            : getColor(data.max)
        };
        return <td style={styleMax} key={i}>
          <WindUnit value={data.max}/>
        </td>;

      case 'avg':
        var styleAvg = {
          background: data.avg == null
            ? '#eee'
            : getColor(data.avg)
        };
        return <td style={styleAvg} key={i}>
          <b>
            <WindUnit value={data.avg}/>
          </b>
        </td>;

      case 'min':
        var styleMin = {
          background: data.min == null
            ? '#eee'
            : getColor(data.min)
        };
        return <td style={styleMin} key={i}>
          <WindUnit value={data.min}/>
        </td>;

      case 'temperature':
        var propsTemp = {
          style : {
            background: data.temperature == null
              ? rgbaNc
              : getColorTemp(data.temperature)
          },
          key: i
        };
        return <td {...propsTemp}>
          <TempUnit value={data.temperature}/>
        </td>;

      case 'humidity':
        var propsHumi = {
          style: {
            background: data.humidity == null || data.humidity > 100
              ? rgbaNc
              : getHumidityColor(data.humidity)
          },
          key: i
        };
        return <td {...propsHumi}>
          {data.humidity == null || data.humidity > 100
            ? '--'
            : Math.round(data.humidity) + '%'
          }
        </td>;

      case 'pressure':
        var propsPressure = {
          style: {
            background: rgbaNc
          },
          key: i
        };
        return <td {...propsPressure}>
          {data.pressure == null
            ? '--'
            : Math.round(data.pressure)
          }
        </td>;

      case 'rain':
        return <td style={{background: 'rgba(255,255,255,0.55)'}} key={i}>
          <RainUnit value={data.rain}/>
        </td>;

      default:
        break;
    }
  }
  render() {
    let { detail, presentsKeys } = this.props;

    return <div>
      <table className="main">
        <tbody>
          {presentsKeys.map( key => {
            return <tr key={key}>
              {detail.items.map( (e, i) => {
                return this.dataFilters(e, key, key + '_' + i);
              })}
            </tr>;
          })}
        </tbody>
      </table>
    </div>;
  }
}

ArrayWidget.propTypes = {
  detail: PropTypes.any,
  displayDetail: PropTypes.any,
  presentsKeys: PropTypes.array
};

export default ArrayWidget;
