async function drawBars() {
  //* Step 1. Access data
  const json = await d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );

  const dataset = json.data;

  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d[0]);
  const yAccessor = (d) => d[1];

  //* Step 2. Create chart dimensions
  const width = Math.max(650, window.innerWidth * 0.8);

  const dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 75,
      right: 25,
      bottom: 50,
      left: 75,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //* Step 3. Draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  //* Step 4. Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    // .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  //* Step 5. Draw data
  const allBarsGroup = bounds.append("g");

  const barGroups = allBarsGroup.selectAll("g").data(dataset).join("g");

  const barPadding = 1;
  const barWidth = dimensions.boundedWidth / dataset.length;
  const barRects = barGroups
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => yAccessor(d))
    .attr("x", (d) => xScale(xAccessor(d)) + barPadding / 2)
    .attr("y", dimensions.boundedHeight)
    .attr("transform-origin", "center")
    .attr("width", barWidth)
    .attr("height", 0)
    .transition()
    .ease(d3.easeCubicOut)
    .duration(1000)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)));

  //* Step 6. Draw peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .attr("id", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .attr("role", "presentation")
    .attr("aria-hidden", true);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = bounds
    .append("g")
    .call(yAxisGenerator)
    .attr("id", "y-axis")
    .attr("role", "presentation")
    .attr("aria-hidden", true);
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 25)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .style("font-family", "Inter")
    .style("font-size", "1.4em")
    .style("letter-spacing", "0.5px")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");

  const title = wrapper
    .append("text")
    .attr("id", "title")
    .attr("x", dimensions.width / 2)
    .attr("y", 48)
    .style("text-anchor", "middle")
    .style("font-size", "2em")
    .style("font-weight", "500")
    .text("United States GDP");

  const source = wrapper
    .append("text")
    .attr("x", dimensions.width - dimensions.margin.right)
    .attr("y", dimensions.height - 10)
    .style("text-anchor", "end")
    .style("font-size", "0.8em")
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  //* Step 7. Set up interactions
  const tooltip = d3.select("#tooltip");

  function onMouseEnter(event, d) {
    tooltip.select("#date").text(d3.timeFormat("%Y Q%q")(xAccessor(d)));
    tooltip.select("#gdp").text(d3.format(",")(yAccessor(d)));

    const x = xScale(xAccessor(d)) + barWidth / 2 + dimensions.margin.left;
    const y = yScale(yAccessor(d)) + dimensions.margin.top;
    tooltip
      .attr("data-date", d[0])
      .style("transform", `translate(calc(${x}px - 50%), calc(${y}px - 100%))`)
      .style("opacity", 1);
  }
  function onMouseLeave() {
    tooltip.attr("data-date", null).style("opacity", 0);
  }

  barGroups.on("mouseenter", onMouseEnter).on("mouseleave", onMouseLeave);
}

drawBars();
