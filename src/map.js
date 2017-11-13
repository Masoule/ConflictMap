var numberFormat = d3.format(",d")
// var mapPath = 'https://raw.githubusercontent.com/Masoule/WarMaps/master/data/map_data.csv';
var default_color = d3.rgb("#f7f7f7");
var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];
var mapPath = 'https://s3.amazonaws.com/war-maps/worldMap.json';

export function filterMapData(data, year) {
  return data.filter(d => d.year >= year - 10 && d.year <= year )
}

export function initializeMap(data, color) {
  // debugger
  // debugger
  d3.json(mapPath, function(error, worldmap) {
    // worldMap = JSON.parse( mapPath )
    if (error) throw error;
    //adds colors
    svg.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(topojson.feature(worldmap, worldmap.objects.world).features)
      .enter().append("path")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .call(fillMap, color, data)

    //add circles
    var circles = svg.append("g")
    .attr("class", "circles")

    circles.selectAll("circle")
    .data(topojson.feature(worldmap, worldmap.objects.world).features)
    .enter().append("circle")
    .attr('class', 'circle')
    .attr('id', d => d.id)
    .attr("transform", function(d) { /*console.log(d, path.centroid(d));*/ return path.centroid(d)[0] ? "translate(" + path.centroid(d) + ")" : "translate(0,0)"; })
    .on("mouseover", (d) => mouseover(d, data))
    .on("mouseout", function(d) {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    })
    .call(addCircle, data)
  })
}

export function updateMap(color, data) {
  // update colors
  d3.selectAll("svg#map path").transition()
    .delay(50)
    .call(fillMap, color, data)

  //update circles
  d3.selectAll("svg#map circle").transition()
    .delay(50)
    .call(addCircle, data);

  d3.selectAll("svg#map circle")
  .on("mouseover", (d) => mouseover(d, data))

  // update path titles
  // d3.selectAll("svg#map path title")
  //   .call(showInfo, data);
}

function mouseover(d, data) {
  var data_row = data.filter(dd => dd.id ===d.id)
  data_row = data_row.length ? data_row[0] : {killed: 0}
  div.transition()
  .duration(200)
  .style("opacity", .9);
  div.html(data_row.name + "<br/>" + data_row.description + "<br/>" + (data_row.killed===0 ? 'uknonwn' : "over " + numberFormat(data_row.killed)) + " casualties" + "<br/>")
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");
}

function addCircle(selection, data) {
  var radius = d3.scaleSqrt()
    .domain([0, 5000])//d3.max(data, d => d.killed)])
    .range([0, 15]);

  selection
      .attr('class', function(d, i) {
        var data_row = data.filter(dd => dd.id ===d.id)
        if(data_row.length) {
        }
        return data_row.length && data_row[0].killed===0 ? 'circle unknown' : 'circle'
      })
      .attr("r", function(d, i) {
        var data_row = data.filter(dd => dd.id ===d.id)
        data_row = data_row.length ? data_row[0] : {killed: -1 }

        return data_row.killed === 0 ?
        5 : (data_row.killed < 0 ? undefined : radius(data_row.killed));
      })
}

//optional functions for adding color gradient to countries
export function colorGradient(data) {
  let data_values = data.sort( function(a, b){ return a.killed - b.killed; });
  var quantiles_calc = quantiles.map( function(elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
  .domain(quantiles_calc)
  .range(d3.schemeGreys[(quantiles_calc.length)-1]);
  return scale;
}

export function fillMap(selection, color, data) {
  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? default_color : d3.rgb(color(data[d.id])); });
}
