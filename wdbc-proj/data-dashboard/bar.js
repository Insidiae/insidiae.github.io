//* IV. Make Bar Chart
// setup the bar chart SVG
function createBar(width, height) {
  const bar = d3.select("#bar")
    .attr("width", width)
    .attr("height", height)

  bar.append("g")
    .classed("x-axis", true);

  bar.append("g")
    .classed("y-axis", true);

  bar.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", - height / 2)
    .attr("dy", "1em")
    .attr("font-size", "1em")
    .style("text-anchor", "middle")
    .classed("y-axis-label", true);

  bar.append("text")
    .attr("x", width / 2)
    .attr("y", "1em")
    .attr("font-size", "1.5em")
    .style("text-anchor", "middle")
    .classed("bar-title", true);
}

// draw the bar chart
function drawBar(data, dataType, country) {
  // set basic properties of the bar chart
  const bar = d3.select("#bar");
  const padding = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 110
  }
  const barPadding = 1;
  const width = +bar.attr("width")
  const height = +bar.attr("height")
  const t = d3.transition()
    .duration(1000)
    .ease(d3.easeBounceOut);

  // filter the data to the appropriate country, and sort by year
  //! Note: by passing an empty string, we should get an empty array
  //! and thus we also remove all the bars from the chart
  const countryData = data.filter(d => d.country === country)
    .sort((a, b) => a.year - b.year);

  // create scales, and set bar width based on the scale
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([padding.left, width - padding.right]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(countryData, d => d[dataType])])
    .range([height - padding.bottom, padding.top])

  //! Note: this sets barWidth equal to the scaled value of one year
  const barWidth = xScale(xScale.domain()[0] + 1) - xScale.range()[0];

  // set up axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format(".0f"))

  d3.select(".x-axis")
    .attr("transform", `translate(0, ${height - padding.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  d3.select(".y-axis")
    .attr(
      "transform",
      `translate(${padding.left - barWidth / 2} , 0)`
    )
    .transition()
    .duration(1000)
    .call(yAxis);

  // update title and axis labels
  const axisLabel = dataType === "emissions" ?
  "CO2 Emissions, thousand metric tons" :
  "CO2 Emissions, metric tons per capita";

  const barTitle = country ?
  `CO2 Emissions, ${country}` :
  "Click on a country to see annual trends.";

  d3.select(".y-axis-label")
    .text(axisLabel);

  d3.select(".bar-title")
    .text(barTitle);

  // use General Update Pattern to display bar chart
  const update = bar
      .selectAll(".bar")
      .data(countryData);

  // 1. Remove elements from exit selection
  update.exit()
      .transition(t)
      .delay((d, i, nodes) => (nodes.length - i - 1) * 100)
      .attr("y", height - padding.bottom)
      .attr("height", 0)
      .remove();

  // 2. Append a new rectangle for each new data
  update.enter()
    .append("rect")
      .classed("bar", true)
      .attr("y", height - padding.bottom)
      .attr("height", 0)
  // 3. Update attributes for existing data
    .merge(update)
      .attr("x", d => (xScale(d.year) + xScale(d.year - 1)) / 2)
      .attr("width", barWidth - barPadding)
      .transition(t)
      .delay((d, i) => i * 100)
        .attr("y", d => yScale(d[dataType]))
        .attr(
          "height",
          d => height - padding.bottom - yScale(d[dataType])
        );
}

// highlight each individual bar based on the selected year
function highlightBars(currentYear) {
  d3.select("#bar")
    .selectAll("rect")
      .attr("fill", d => d.year === currentYear ? "#ab58fd" : "#588dfd");
}