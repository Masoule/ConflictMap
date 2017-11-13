var rawData, filteredData;

export function renderPlot(selectedYear) {
  // var plotCSV = path.resolve('wwwroot', '../data/plot_data_1.csv');
  var plotCSV = 'https://s3.amazonaws.com/war-maps/plot_data_1.csv';
  // var plotCSV = 'https://raw.githubusercontent.com/Masoule/WarMaps/master/data/plot_data_1.csv';
  console.log(plotCSV)
  d3.csvParse(plotCSV, function(csv) {
    // json = cs.parse( myjson );
    rawData = csv.map(d => {
      d.killed = +d['total_mortalities']
      d.year = +d.year
      return d
    }).sort((a, b) => a.year - b.year)

    filterData(selectedYear)
    initializeChart()
  })
}

function filterData(thisYear) {

  filteredData = rawData.filter( d => d.year <= thisYear)

  //update headline
  let yearRange = thisYear - 10;
  let total = 0;
  var rangeData = rawData.filter( d => { return d.year <= thisYear && d.year >= yearRange; })
  rangeData.map( (d) => total += d.killed )

  var thisYearData = filteredData.filter( d => {  return parseInt(d.year) === parseInt(thisYear); })
  thisYearData = thisYearData.length ? thisYearData[0] : {killed: 10}
  d3.select("h2").text( "over " + numberFormat(total) + " between " + yearRange + " and " + thisYear );
}

function initializeChart() {
  var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.year); })
    .y1(function(d) { return y(d.killed); });

  x.domain(d3.extent(rawData, function(d) { return d.year; }));
  y.domain([0, d3.max(rawData, function(d) { return d.killed; })]);
  area.y0(y(0));

  let plot = d3.select("svg#plot g.plot")
  plot.selectAll('path').remove()

  plot.append("path")
      .datum(filteredData)
      .attr("fill", "red")
      .attr("d", area)
      .on('mouseover', (d) => {
      })

  // plot.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x));

  // plot.append("g")
  //     .call(d3.axisLeft(y))

  plot.append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
}
