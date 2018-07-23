import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';


class DragAndZoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      translation: { x: 0, y: 0 }
    };
  }

  render() {
    const { scale, translation } = this.state;
    console.log(this.state.scale, this.state.translation);
    return (
      <MapInteractionCSS
        scale={scale}
        translation={translation}
        onChange={({ scale, translation }) => this.setState({ scale, translation })}
      >
        <div style={{height: 200, width: 300, background: 'red'}}/>
      </MapInteractionCSS>
    );
  }

}

export default DragAndZoom;
