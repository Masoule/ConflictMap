function renderPlot(selectedYear) {
  var area = d3.area()
      .x(function(d) { return x(d.year); })
      .y1(function(d) { return y(d.killed); });

      // var filteredData = consdata.filter(function(d)
      // { if(d["Criticality"]=="Low")
      //         { return d;}
      //     })

  d3.csv("data.csv", function(csv) {
    console.log("@@@",csv)
      csv = csv.filter(function(d) {
        return parseInt(d['year']) <= selectedYear;
      })
      console.log(csv)
    }
  )

  console.log(selectedYear, filteredData)

  d3.csv(filteredData, function(d) {
    d.year = parseInt(d.year);
    d.description = d.description;
    d.killed = +d.killed;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.killed; })]);
    area.y0(y(0));

    let plot = d3.select("svg#plot g.plot")

    plot.append("path")
        .datum(data)
        .attr("fill", "red")
        .attr("d", area);
    plot.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    plot.append("g")
        .call(d3.axisLeft(y))
    plot.append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("total casualties");
  });
}
