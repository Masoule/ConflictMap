function fillMap(selection, color, data) {
  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? default_color : d3.rgb(color(data[d.id])); });
}
//
// function addCircle(selection, data) {
//   var radius = d3.scaleSqrt()
//     .domain([0, 1e6])
//     .range([0, 15]);
//
//   selection
//     .attr("r", function(d) {
//       return typeof data[d.id] === 'undefined' ?
//       0 : radius(data[d.id])*20;
//     });
// }

// function showInfo(selection, data) {
//   selection
//   .text(function(d) { return "" + d.id + ", " +
//   (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
// }
//
// function colorGradient(data) {
//   let data_values = Object.values(data).sort( function(a, b){ return a-b; });
//   quantiles_calc = quantiles.map( function(elem) {
//     return Math.ceil(d3.quantile(data_values, elem));
//   });
//
//   let scale = d3.scaleQuantile()
//   .domain(quantiles_calc)
//   .range(d3.schemeGreys[(quantiles_calc.length)-1]);
//
//   return scale;
// }
