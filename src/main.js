function fillMap(selection, color, data) {
  selection
  .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? color_na : d3.rgb(color(data[d.id])); });
}

function setPathTitle(selection, data) {
  selection
  .text(function(d) { return "" + d.id + ", " +
  (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function calcColorScale(data) {
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
  .domain(quantiles_calc)
  .range(d3.schemeReds[(quantiles_calc.length)-1]);

  return scale;
}
