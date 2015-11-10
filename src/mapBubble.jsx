"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  Polygon,
  Graticule,
  Mesh,
  Svg,
  Circle,
  scale as domainScaleFunc,
  projection as projectionFunc,
  geoPath as geoPathFunc
} from 'react-d3-map-core';

export default class MapBubble extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      width,
      height,
      showGraticule,
      dataPolygon,
      polygonClass,
      meshClass,
      dataMesh,
      scale,
      translate,
      precision,
      rotate,
      center,
      clipAngle,
      parallels,
      projection,
      domain,
      dataCircle,
      circleValue,
      circleClass
    } = this.props;

    var proj = projectionFunc({
      projection: projection,
      scale: scale,
      translate: translate,
      precision: precision,
      rotate: rotate,
      center: center,
      clipAngle: clipAngle,
      parallels: parallels
    });

    var geoPath = geoPathFunc(proj);

    var domainScale = domainScaleFunc(domain);

    var graticule, mesh, polygon, circle;

    if(showGraticule){
      graticule = (
        <Graticule
          geoPath= {geoPath}
        />
      )
    }

    if(dataPolygon && !Array.isArray(dataPolygon)) {
      polygon = (
        <Polygon
          data = {dataPolygon}
          geoPath= {geoPath}
          polygonClass= {polygonClass}
        />
      )
    }else {
      polygon = dataPolygon.map((d, i) => {
        return (
          <Polygon
            key = {i}
            data = {d}
            geoPath= {geoPath}
            polygonClass= {polygonClass}
          />
        )
      })
    }


    if(dataMesh && !Array.isArray(dataMesh)) {
      mesh = (
        <Mesh
          data = {dataMesh}
          geoPath= {geoPath}
          meshClass= {meshClass}
        />
      )
    } else {
      mesh = dataMesh.map((d, i) => {
        return (
          <Mesh
            key = {i}
            data = {d}
            geoPath= {geoPath}
            meshClass= {meshClass}
          />
        )
      })
    }

    var r = (d) => {return domainScale(circleValue(d)); }
    if(dataCircle && !Array.isArray(dataCircle)) {
      circle = (
        <Circle
          data = {dataCircle}
          geoPath= {geoPath}
          circleClass= {circleClass}
          r= {r}
        />
      )
    } else {
      circle = dataCircle.map((d, i) => {
        return (
          <Circle
            key = {i}
            data = {d}
            geoPath= {geoPath}
            circleClass= {circleClass}
            domainScale= {domainScale}
            circleValue= {circleValue}
            r= {r}
          />
        )
      })
    }

    return (
      <Svg
        width={width}
        height={height}
      >
        {graticule}
        {polygon}
        {mesh}
        {circle}
      </Svg>
    )
  }
}
