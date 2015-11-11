"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  Svg,
  Tooltip
} from 'react-d3-map-core';

import {
  default as Map
} from './map';

export default class MapBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xTooltip: null,
      yTooltip: null,
      contentTooltip: null
    }
  }

  _onMouseOver (dom, d, i) {
    const {
      tooltipContent
    } = this.props

    this.setState({
      xTooltip: d3.event.clientX,
      yTooltip: d3.event.clientY,
      contentTooltip: tooltipContent(d)
    })
  }

  _onMouseOut (dom, d, i) {
    this.setState({
      xTooltip: null,
      yTooltip: null,
      contentTooltip: null
    })
  }

  render() {
    const {
      width,
      height,
      showTooltip,
      tooltipContent
    } = this.props;

    var tooltip;

    var onMouseOut = this._onMouseOut.bind(this);
    var onMouseOver = this._onMouseOver.bind(this);

    if(showTooltip) {
      var tooltip = (
        <Tooltip
          {...this.state}
          content= {tooltipContent}
        />
      )
    }

    return (
      <div>
        {tooltip}
        <Svg
          width={width}
          height={height}
        >
          <Map
            {...this.props}
            {...this.state}
            onMouseOver= {onMouseOver}
            onMouseOut= {onMouseOut}
            />
        </Svg>
      </div>
    )
  }
}
