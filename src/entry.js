// require "../src/plot.js";
// require "../src/map.js";
import * as map from "./map.js"
import * as plot from "./plot.js"
window.map = map;
window.plot = plot;

var start_year = 1400;
// var headline = "Number of casualties";
// var mapPath = path.resolve('wwwroot', 'worldMap.json');

//map element
var width = (window.innerWidth) * 0.9,
    height = (window.innerHeight) * 0.7;

var svg = d3.select("body").insert("svg")
  .attr("id", "map")
  .attr("height", height)
  .attr("width", width);

var projection = d3.geoRobinson()
  .translate([width / 2, height / 2]);

var path = d3.geoPath(d3.geoRobinson().translate([width / 2, height / 2]));
//alternative rectangular map
// var path = d3.geoPath(d3.geoEquirectangular().translate([width / 2, height / 2]));

//alternative online map
// var mapPath = "https://unpkg.com/world-atlas@1/world/110m.json";

//tooltip
var div = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

//plot element
d3.select("body").insert("p")
//headline
d3.select("body p").insert("h1", ":first-child")
  .text("Human Casualties of War");
d3.select("body p").insert("h2")

var margin =
    {top: (window.innerHeight) * 0.1, right:10, bottom:0, left:10},
    plotWidth = width - margin.left - margin.right,
    plotHeight = (window.innerHeight) * 0.4 - margin.top - margin.bottom;

var x = d3.scaleLinear()
      .rangeRound([0, plotWidth]),
    y = d3.scaleLinear()
      .rangeRound([plotHeight, 0]);

var plotEl = d3.select("p")
    .append("svg")
      .attr("id", "plot")
      .attr("width", plotWidth + margin.left + margin.right)
      .attr("height", plotHeight + margin.top + margin.bottom)
    .append("g")
      .attr("class", "plot")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// slider element
d3.select("p").append("input")
  .attr("type", "range")
  .attr("min", "1400")
  .attr("max", "2000")
  .attr("value", start_year)
  .attr("id", "slider")
  .style("width", width + "px")

//find country id's to find the location on map
var rawMapData
var country_to_id

// var idsCSV = path.resolve( 'wwwroot', '../data/country_to_id.csv' );
// var idsCSV = 'https://raw.githubusercontent.com/Masoule/WarMaps/master/data/country_to_id.csv';
var idsCSV = 'https://s3.amazonaws.com/war-maps/country_to_id.csv';
d3.csv( idsCSV, function(ids) {
  country_to_id = ids
})

//load map data
// var mapCSV = path.resolve('wwwroot', '../data/map_data.csv');
// var mapCSV = 'https://raw.githubusercontent.com/Masoule/WarMaps/master/dist/worldMap.json';
var mapCSV = 'https://s3.amazonaws.com/war-maps/map_data.csv';
d3.csv(mapCSV, function(csv) {
  rawMapData = csv.map( d => {
    d.killed = +d.killed
    d.year = +d.year
    d.duration = +d.duration
    d.name = d.name
    d.country = d.country.trim()
    var id_array = country_to_id.filter(dd => d.country === dd.country )
    d.id = id_array.length ? id_array[0].id : 'X'
    d.description = d.description
    return d
  })

  let data = map.filterMapData(rawMapData, start_year)
  let color = map.colorGradient(data);
  // load map
  // debugger
  map.initializeMap(data, color)
  //add plot
  plot.renderPlot(start_year);

  // update with slider input
  d3.select("#slider").on("input", function() {
      console.log(this.value)
      let selectedYear = this.value;
      let newData = map.filterMapData(rawMapData, selectedYear)
      let newColor = map.colorGradient(newData);
      map.updateMap(newColor, newData);
      plot.renderPlot(selectedYear);
  });

}); //data
