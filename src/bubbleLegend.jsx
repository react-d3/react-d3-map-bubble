"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  default as ReactFauxDOM,
} from 'react-faux-dom';

import {
  isTooltipUpdate
} from 'react-d3-map-core';

export default class BubbleLegend extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isTooltipUpdate(nextProps, nextState, this);
  }

  _mkLegend (dom) {

    const {
      width,
      height,
      domain,
      domainScale,
      circleValue
    } = this.props;

    var g = d3.select(dom);

    var legend = g.attr('class', 'legend')
      .attr("transform", "translate(" + (width - (domain.range[1] * 2 + 20)) + "," + (height - 20) + ")")
    .selectAll('g')
      .data([domain.domain[1] * 2 / 3, domain.domain[1] * 2 / 3, domain.domain[1] * 2])
    .enter().append('g')

    legend.append('circle')
      .attr('cy', (d) => {return -domainScale(d); })
      .attr('r', domainScale);

    return g;
  }

  render() {
    var legendGroup = ReactFauxDOM.createElement('g');
    var leg = this._mkLegend(legendGroup)

    return leg.node().toReact();
  }

}
