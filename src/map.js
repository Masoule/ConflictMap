var numberFormat = d3.format(",d")

function filterMapData(data, year) {
  return rawMapData.filter(d => d.year >= year - 10 && d.year <= year )
}

function initializeMap(data, color) {
  d3.json(mapPath, function(error, worldmap) {
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

    //circles.selectAll("circle").remove()

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

function updateMap(color, data) {
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

function colorGradient(data) {
  // console.log(data)
  let data_values = data.sort( function(a, b){ return a.killed-b.killed; });
  quantiles_calc = quantiles.map( function(elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
  .domain(quantiles_calc)
  .range(d3.schemeGreys[(quantiles_calc.length)-1]);

  return scale;
}

function addCircle(selection, data) {
  var radius = d3.scaleSqrt()
    .domain([0, 5000])//d3.max(data, d => d.killed)])
    .range([0, 15]);

  selection
      .attr('class', function(d, i) {
        var data_row = data.filter(dd => dd.id ===d.id)
        if(data_row.length) {
          console.log(data_row[0], data_row[0].killed)
        }
        return data_row.length && data_row[0].killed===0 ? 'circle unknown' : 'circle'
      })
      .attr("r", function(d, i) {
        var data_row = data.filter(dd => dd.id ===d.id)
        data_row = data_row.length ? data_row[0] : {killed: -1}
        //console.log(data_row)

        return data_row.killed===0 ?
        10 : radius(data_row.killed);
      })

}
