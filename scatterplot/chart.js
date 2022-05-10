async function drawDots() {
  //* Step 1. Access data
  const dataset = await d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );

  const timeParser = d3.timeParse("%M:%S");
  const yAccessor = (d) => timeParser(d.Time);
  const xAccessor = (d) => d.Year;
  const colorAccessor = (d) => Boolean(d.Doping);

  //* Step 2. Create chart dimensions
  const chartSize = Math.max(
    650,
    Math.min(window.innerWidth, window.innerHeight) * 0.8
  );
  // const chartSize = 700;

  let dimensions = {
    width: chartSize,
    height: chartSize,
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
    .scaleLinear()
    //? Add a bit of "padding" to the x axis
    .domain([
      d3.min(dataset, (d) => d.Year - 1),
      d3.max(dataset, (d) => d.Year + 1),
    ])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, yAccessor))
    .range([0, dimensions.boundedHeight])
    .nice();

  const colorScale = d3
    .scaleOrdinal()
    .domain([true, false])
    .range(["hsl(221deg 98% 67%)", "hsl(11deg 98% 67%)"]); //["#588dfd", "#fd7758"]

  //* Step 5. Draw data
  const dots = bounds.selectAll("circle").data(dataset);

  dots
    .join("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => xAccessor(d))
    .attr("data-yvalue", (d) => yAccessor(d))
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("fill", (d) => colorScale(colorAccessor(d)))
    .attr("r", 5);

  //* Step 6. Draw peripherals
  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.format(""));
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .attr("id", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));
  const yAxis = bounds.append("g").call(yAxisGenerator).attr("id", "y-axis");

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", 0)
    .attr("y", -dimensions.margin.left + 25)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .style("font-size", "1.6em")
    .style("font-weight", "bold")
    .style("text-anchor", "end")
    .text("Time in Minutes");

  const title = wrapper
    .append("g")
    .attr("id", "title")
    .style("transform", `translate(${dimensions.width / 2}px, ${35}px)`);

  title
    .append("text")
    .attr("fill", "black")
    .style("font-size", "1.6em")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Doping in Professional Bicycle Racing");

  title
    .append("text")
    .attr("y", 25)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .style("font-weight", "medium")
    .style("text-anchor", "middle")
    .text("35 Fastest times up Alpe d'Huez");

  const legend = bounds
    .append("g")
    .attr("id", "legend")
    .style(
      "transform",
      `translate(${dimensions.boundedWidth}px, ${
        dimensions.boundedHeight / 2 - 50
      }px)`
    );

  legend
    .append("text")
    .attr("x", -35)
    .attr("class", "legend-text")
    .text("No doping allegations");
  legend
    .append("rect")
    .attr("x", -25)
    .attr("y", -12.5)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "hsl(11deg 98% 67%)"); //"#fd7758"

  legend
    .append("text")
    .attr("x", -35)
    .attr("y", 25)
    .attr("class", "legend-text")
    .text("Riders with doping allegations");
  legend
    .append("rect")
    .attr("x", -25)
    .attr("y", 12.5)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "hsl(221deg 98% 67%)"); //"#588dfd"

  //* Step 7. Set up interactions
  const tooltip = d3.select("#tooltip");

  const delaunay = d3.Delaunay.from(
    dataset,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );
  const voronoi = delaunay.voronoi();
  voronoi.xmax = dimensions.boundedWidth;
  voronoi.ymax = dimensions.boundedHeight;

  const voronoiCell = bounds
    .selectAll(".voronoi")
    .data(dataset)
    .join("path")
    .attr("class", "voronoi")
    .attr("d", (d, i) => voronoi.renderCell(i));

  function onMouseEnter(event, d) {
    const formatTime = d3.timeFormat("%M:%S");
    tooltip.select("#name").text(d.Name);
    tooltip.select("#nationality").text(d.Nationality);
    tooltip.select("#year").text(xAccessor(d));
    tooltip.select("#time").text(formatTime(yAccessor(d)));
    tooltip
      .select("#doping")
      .style("display", colorAccessor(d) ? "block" : "none")
      .text(d.Doping);

    const x = xScale(xAccessor(d)) + dimensions.margin.left;
    const y = yScale(yAccessor(d)) + dimensions.margin.top;

    tooltip
      .attr("data-year", xAccessor(d))
      .style("transform", `translate(calc(${x}px - 50%), calc(${y}px - 100%))`)
      .style("opacity", 1);

    //? Since we can't apply a z-index to an svg element,
    //? we'll just create a temporary fake dot to display
    //? on top of the currently "hovered" dot
    const tooltipDot = bounds
      .append("circle")
      .attr("class", "tooltip-dot")
      .attr("cx", xScale(xAccessor(d)))
      .attr("cy", yScale(yAccessor(d)))
      .attr("fill", colorScale(colorAccessor(d)))
      .style("pointer-events", "none")
      .transition()
      .duration(250)
      .attr("r", 7);
  }
  function onMouseLeave() {
    tooltip.attr("data-year", null).style("opacity", 0);
    d3.selectAll(".tooltip-dot")
      .transition()
      .duration(500)
      .attr("r", 0)
      .remove();
  }

  voronoiCell.on("mouseenter", onMouseEnter).on("mouseleave", onMouseLeave);

  //? This is only for making the freeCodeCamp tests pass.
  //? The real user interactions should be handled by the Voronoi diagram.
  bounds
    .selectAll("circle")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave);
}

drawDots();
