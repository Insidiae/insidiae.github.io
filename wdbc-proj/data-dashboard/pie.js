//* III. Make Pie Chart
// setup the pie chart SVG
function createPie(width, height) {
  const pie = d3.select("#pie")
    .attr("width", width)
    .attr("height", height);

  pie.append("g")
    .attr(
      "transform",
      `translate(${width / 2}, ${height / 2 + 10})`
    )
    .classed("chart", true);

  pie.append("text")
    .attr("x", width / 2)
    .attr("y", "1em")
    .attr("font-size", "1.5em")
    .style("text-anchor", "middle")
    .classed("pie-title", true);
}

// draw the pie chart
function drawPie(data, currentYear) {
  const pie = d3.select("#pie");

  const arcs = d3.pie()
    .sort((a, b) => {
      // sort arcs first by continent, then by emissions
      if (a.continent < b.continent) return -1;
      if (a.continent > b.continent) return 1;
      return a.emissions - b.emissions;
    })
    .value(d => d.emissions);

  const path = d3.arc()
    .outerRadius(+pie.attr("height") / 2 - 50)
    .innerRadius(0);

  // filter the data for the current year
  const yearData = data.filter(d => d.year === currentYear);
  // create an array of continents
  const continents = [];
  for(let i = 0; i < yearData.length; i++) {
    const continent = yearData[i].continent;
    if(!continents.includes(continent)) {
      continents.push(continent);
    }
  }

  // use continents array to set up color scale
  const colorScale = d3.scaleOrdinal()
    .domain(continents)
    .range(["#fd58d4", "#ab58fd", "#58fd58", "#588dfd", "#8da0c8"])

  // use General Update Pattern to display the pie chart
  const update = pie.select(".chart")
    .selectAll(".arc")
    .data(arcs(yearData));

  // 1. Remove elements from the exit selection
  update.exit().remove();

  // 2. Append a new path element for each new data
  console.log("update pie")
  update.enter()
    .append("path")
      .classed("arc", true)
      .attr("stroke","#dff1ff")
      .attr("stroke-width", "0.25px")
  // 3a. update the path and color for existing data
    .merge(update)
      .attr("fill", d => colorScale(d.data.continent))
      .attr("d", path);

  // 3b. update the chart title
  d3.select(".pie-title")
    .text(`Total emissions by continent and region, ${currentYear}`);
}