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
  Circle,
  Voronoi,
  isTooltipUpdate,
  scale as domainScaleFunc,
  projection as projectionFunc,
  geoPath as geoPathFunc
} from 'react-d3-map-core';

import {
  default as Legend
} from './bubbleLegend';

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isTooltipUpdate(nextProps, nextState, this);
  }

  _dataPosition (d, geoPath, proj) {

    const {
      circleX,
      circleY
    } = this.props;

    var type =  d.geometry? d.geometry.type: 'other';

    if(type === 'Polygon' || type === 'MultiPolygon') {
      var x = geoPath.centroid(d)[0];
      var y = geoPath.centroid(d)[1];
    }else if (type === 'Point'){
      var x = proj? +proj(d.geometry.coordinates)[0]: d.geometry.coordinates[0];
      var y = proj? +proj(d.geometry.coordinates)[1]: d.geometry.coordinates[1];
    }else if (type === 'other'){
      var x = proj? +proj([circleX(d), circleY(d)])[0]: circleX(d);
      var y = proj? +proj([circleX(d), circleY(d)])[1]: circleY(d);
    }

    return [x, y]
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
      circleClass,
      showTooltip,
      tooltipContent,
      circleX,
      circleY,
      onMouseOut,
      onMouseOver
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

    var graticule, mesh, polygon, circle, voronoi;

    if(showGraticule){
      graticule = (
        <Graticule
          geoPath= {geoPath}
          {...this.state}
        />
      )
    }

    if(dataPolygon && !Array.isArray(dataPolygon)) {
      polygon = (
        <Polygon
          data = {dataPolygon}
          geoPath= {geoPath}
          polygonClass= {polygonClass}
          {...this.state}
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
            {...this.state}
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
          {...this.state}
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
            {...this.state}
          />
        )
      })
    }

    if(dataCircle && !Array.isArray(dataCircle)) {
      var r = domainScale(circleValue(dataCircle));
      var position = this._dataPosition(dataCircle, geoPath, proj);

      circle = (
        <Circle
          data = {dataCircle}
          geoPath= {geoPath}
          circleClass= {circleClass}
          r= {r}
          x= {position[0]}
          y= {position[1]}
          onMouseOut= {onMouseOut}
          onMouseOver= {onMouseOver}
          {...this.state}
        />
      )
    } else {
      circle = dataCircle.map((d, i) => {
        var r = domainScale(circleValue(d));
        var position = this._dataPosition(d, geoPath, proj);

        return (
          <Circle
            key = {i}
            data = {d}
            geoPath= {geoPath}
            circleClass= {circleClass}
            r= {r}
            x= {position[0]}
            y= {position[1]}
            onMouseOut= {onMouseOut}
            onMouseOver= {onMouseOver}
            {...this.state}
          />
        )
      })
    }

    if(showTooltip) {

      var voronoiX = (d) => {
        var type =  d.geometry? d.geometry.type: 'other';
        if(type === 'Polygon' || type === 'MultiPolygon') {
          return geoPath.centroid(d)[0];
        }else if (type === 'Point') {
          return proj? +proj(d.geometry.coordinates)[0]: d.geometry.coordinates[0]
        }else if (type === 'other') {
          return proj? +proj([circleX(d), circleY(d)])[0]: circleX(d);
        }
      }

      var voronoiY = (d) => {
        var type =  d.geometry? d.geometry.type: 'other';
        if(type === 'Polygon' || type === 'MultiPolygon') {
          return geoPath.centroid(d)[1];
        }else if (type === 'Point') {
          return proj? +proj(d.geometry.coordinates)[1]: d.geometry.coordinates[1]
        }else if (type === 'other') {
          return proj? +proj([circleX(d), circleY(d)])[1]: circleY(d);
        }
      }

      var voronoi= (
        <Voronoi
          data= {dataCircle}
          geoPath= {geoPath}
          x= {voronoiX}
          y= {voronoiY}
          width= {width}
          height= {height}
          onMouseOut= {onMouseOut}
          onMouseOver= {onMouseOver}
          {...this.state}
        />
      )
    }

    return (
      <g>
        {graticule}
        {polygon}
        {mesh}
        {voronoi}
        {circle}
      </g>
    )
  }
}
