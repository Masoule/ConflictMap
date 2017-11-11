function fillMap(selection, color, data) {
  console.log(selection)
  selection
  .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? color_na : d3.rgb(color(data[d.id])); });

  // d3.csv("data.csv")
  // .row(function(d) {
  //   return {
  //     lat: parseFloat(d.lat),
  //     lng: parseFloat(d.lng),
  //     location: d.location,
  //     description: d.description,
  //     year: parseInt(d.year),
  //     killed: parseInt(d.killed),
  //   };
  // })
  // .get(function(err, rows) {
  //   if (err) return console.error(err);
  //   window.rows = rows;

    // let locations = Object.keys(data)
    // locations.map((country)=>
    // svg.append('circle')
    // .attr('class','site')
    // .attr('cx', projection([country.lng,country.lat])[0])
    // .attr('cy', projection([country.lat,country.lat])[1])
    // .attr('r', data[country]/10000)
    // )
  // });
}




function setPathTitle(selection, data) {
  selection
  .text(function(d) { return "" + d.id + ", " +
  (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function calcColorScale(data) {
  // console.log(data, "??/")
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
  .domain(quantiles_calc)
  .range(d3.schemeReds[(quantiles_calc.length)-1]);

  return scale;
}

function updateMap(color, data) {
  // fill paths
  d3.selectAll("svg#map path").transition()
    .delay(50)
    .call(fillMap, color, data);

  // update path titles
  d3.selectAll("svg#map path title")
    .call(setPathTitle, data);

  // update headline
  d3.select("h2").text(headline + d3.select("#year").node().value);
}
