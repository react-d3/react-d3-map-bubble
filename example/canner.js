examples = [
  {
    "link": "mapbubble",
    "title": "Map Bubble"
  },
  {
    "link": "twDengue",
    "title": "Taiwan Dengue Fever"
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
