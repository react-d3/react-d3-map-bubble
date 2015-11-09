"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  default as ReactFauxDOM,
} from 'react-faux-dom';

export default class Circle extends Component {
  constructor(props) {
    super(props);
  }

  _mkCircle(dom) {
    const {
      data,
      circleClass,
      circleValue,
      geoPath,
      domainScale
    } = this.props;

    var circle = d3.select(dom);

    circle
      .datum(data)
      .attr('class', `${circleClass} bubble`)
      .attr("transform", (d) => { return 'translate(' + geoPath.centroid(d) + ')'})
      .attr("r", (d) => { return domainScale(circleValue(d)); })

    return circle;
  }

  render() {
    var circle = ReactFauxDOM.createElement('circle');
    var chart = this._mkCircle(circle)

    return chart.node().toReact();
  }
}
