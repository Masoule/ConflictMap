var rawData, filteredData;
var height = 300

function renderPlot(selectedYear) {
  d3.csv("../data/plot_data.csv", function(csv) {
    rawData = csv.map(d => {
      d.killed = +d.killed
      d.year = +d.year
      return d
    })

    filterData(selectedYear)
    initializeChart()
  })
}

// setTimeout(()=> {
//      filterData(1992)
//      initializeChart()
// }, 2000)

function filterData(year) {
  filteredData = rawData.filter( d => d.year <= year)
  // console.log(filteredData)
}

function initializeChart() {
  var area = d3.area()
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
      .attr("d", area);

  plot.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // plot.append("g")
  //     .call(d3.axisLeft(y))

  plot.append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Total casualties/milion");
}

// renderPlot()
