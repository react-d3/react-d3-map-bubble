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
  Voronoi,
  Tooltip,
  scale as domainScaleFunc,
  projection as projectionFunc,
  geoPath as geoPathFunc
} from 'react-d3-map-core';

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
    this.setState({
      xTooltip: d3.event.clientX,
      yTooltip: d3.event.clientY,
      contentTooltip: d.properties
    })
  }

  _onMouseOut (dom, d, i) {
    this.setState({
      xTooltip: null,
      yTooltip: null,
      contentTooltip: null
    })
  }

  _dataPosition (d, geoPath, proj) {
    var type =  d.geometry.type;

    if(type === 'Polygon' || type === 'MultiPolygon') {
      var x = geoPath.centroid(d)[0];
      var y = geoPath.centroid(d)[1];
    }else if (type === 'Point'){
      var x = proj? +proj(d.geometry.coordinates)[0]: d.geometry.coordinates[0];
      var y = proj? +proj(d.geometry.coordinates)[1]: d.geometry.coordinates[1];
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

    var graticule, mesh, polygon, circle, voronoi, tooltip;

    var onMouseOut = this._onMouseOut.bind(this);
    var onMouseOver = this._onMouseOver.bind(this);

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

      var tooltip = (
        <Tooltip
          {...this.state}
          content= {tooltipContent}
        />
      )

      var voronoiX = (d) => {
        var type =  d.geometry.type;
        if(type === 'Polygon' || type === 'MultiPolygon') {
          return geoPath.centroid(d)[0];
        }else if (type === 'Point') {
          return proj? +proj(d.geometry.coordinates)[0]: d.geometry.coordinates[0]
        }
      }

      var voronoiY = (d) => {
        var type =  d.geometry.type;
        if(type === 'Polygon' || type === 'MultiPolygon') {
          return geoPath.centroid(d)[1];
        }else if (type === 'Point') {
          return proj? +proj(d.geometry.coordinates)[1]: d.geometry.coordinates[1]
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
      <div>
        {tooltip}
        <Svg
          width={width}
          height={height}
        >
          {graticule}
          {polygon}
          {mesh}
          {voronoi}
          {circle}
        </Svg>
      </div>
    )
  }
}
