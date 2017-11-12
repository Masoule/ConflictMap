function filterMapData(data, year) {
  return rawMapData.filter(d => d.year === year)
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
    svg.append("g")
    .attr("class", "circles")
    .selectAll("circle")
    .data(topojson.feature(worldmap, worldmap.objects.world).features)
    .enter().append("circle")
    .attr('class', 'circle')
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .on("mouseover", function(d) {
      div.transition()
      .duration(200)
      .style("opacity", .9);
      div.html(d.country + "<br/>" + d.killed)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    })
    .call(addCircle, data)
}


function colorGradient(data) {
  let data_values = data.killed.sort( function(a, b){ return a-b; });
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
    .domain([0, 1e6])
    .range([0, 15]);

  selection
    .attr("r", function(d) {
      return typeof d.killed === 'undefined' ?
      0 : radius(d.killed])/1000000;
    });
}
