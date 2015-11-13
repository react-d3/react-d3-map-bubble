examples = [
  {
    "link": "mapbubble",
    "title": "Map Bubble"
  },
  {
    "link": "earthquake",
    "title": "Earthquake"
  },
  {
    "link": "earthquake-tile",
    "title": "Earthquake Tile"
  }
];


var canner = examples.map(function(d) {
  return {
    "layout": "./layout.hbs",
    "filename": './' + d.link + '.html',
    "data": {
      "link": d.link,
      "title": d.title
    }
  }
})

module.exports = canner;
