async function drawHeatmap() {
  //* Step 1. Access data
  const res = await d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  );

  const baseTemperature = res.baseTemperature;
  const dataset = res.monthlyVariance;
  //? Sort from oldest to newest
  dataset.sort((current, next) => {
    if (current.year === next.year) {
      return current.month - next.month;
    }

    return current.year - next.year;
  });

  const xAccessor = (d) => d.year;
  const yAccessor = (d) => d.month - 1;
  const varianceAccessor = (d) => d.variance;

  //* Step 2. Create chart dimensions
  const cellHeight = 50;
  const cellSize = 20;
  const numberOfYears = Math.ceil(dataset.length / 12) + 1;
  let dimensions = {
    boundedWidth: cellSize * Math.ceil(dataset.length / 12),
    boundedHeight: cellSize * 12,
    legendWidth: 400,
    legendHeight: 25,
    margin: {
      top: 25,
      right: 0,
      bottom: 150,
      left: 75,
    },
  };

  dimensions.width =
    dimensions.boundedWidth + dimensions.margin.left + dimensions.margin.right;
  dimensions.height =
    dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom;

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
  const barPadding = 0;
  const totalBarDimension = d3.min([
    dimensions.boundedWidth / numberOfYears,
    dimensions.boundedHeight / 12,
  ]);

  const xScale = d3
    .scaleBand()
    .domain(dataset.map((dataPoint) => dataPoint.year))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([0, dimensions.boundedHeight]);

  const colorRange = d3
    .scaleLinear()
    .domain([
      baseTemperature + d3.min(dataset, varianceAccessor),
      baseTemperature + d3.max(dataset, varianceAccessor),
    ])
    .range([1, 0])
    .clamp(true);
  const colorGradient = d3.interpolateRdYlBu;
  const colorScale = (d) => colorGradient(colorRange(d) || 0);

  //* Step 5. Draw data
  const days = bounds
    .selectAll(".cell")
    .data(dataset)
    .join("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => yAccessor(d))
    .attr("data-year", (d) => xAccessor(d))
    .attr("data-temp", (d) => baseTemperature + varianceAccessor(d))
    .attr("x", (d) => xScale(xAccessor(d)))
    .attr("width", (d) => xScale.bandwidth(xAccessor(d)))
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("height", (d) => yScale.bandwidth(yAccessor(d)))
    .style("fill", (d) => colorScale(baseTemperature + varianceAccessor(d)));

  //* Step 6. Draw peripherals
  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(xScale.domain().filter((year) => year % 10 === 0));
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .attr("id", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(function (month) {
      const date = new Date();
      date.setMonth(month);
      return date.toLocaleString("en-US", { month: "long" });
    });
  const yAxis = bounds.append("g").call(yAxisGenerator).attr("id", "y-axis");

  const colorRangeDomain = colorRange.domain();
  const colorAxisScale = d3
    .scaleLinear()
    .domain(colorRangeDomain)
    .range([0, dimensions.legendWidth]);
  const colorAxisGenerator = d3
    .axisBottom()
    .scale(colorAxisScale)
    .tickFormat(d3.format(".1f"));

  const legend = wrapper
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${
        dimensions.height - dimensions.margin.bottom + 50
      })`
    );

  const colorAxisTicks = colorAxisScale.ticks().slice(0, -1);
  const legendColors = legend
    .append("g")
    .selectAll("rect")
    .data(colorAxisTicks)
    .enter()
    .append("rect")
    .attr("x", (d) => colorAxisScale(d))
    .attr(
      "width",
      colorAxisScale(colorAxisTicks[1]) - colorAxisScale(colorAxisTicks[0])
    )
    .attr("height", dimensions.legendHeight)
    .attr("fill", (d) => colorScale(d));
  const colorAxis = legend
    .append("g")
    .call(colorAxisGenerator)
    .attr("transform", `translate(0, ${dimensions.legendHeight})`);
  const colorAxisLabel = legend
    .append("text")
    .attr(
      "transform",
      `translate(${dimensions.legendWidth / 2 - 8}, ${
        dimensions.legendHeight + 32
      })`
    )
    .attr("text-anchor", "middle")
    .style("font-size", "0.8em")
    .html("Temperature (&deg;C)");

  //* Step 7. Set up interactions
  const tooltip = d3.select("#tooltip");

  function onMouseEnter(event, d) {
    tooltip
      .select("#date")
      .text(d3.timeFormat("%B %Y")(new Date(d.year, d.month - 1)));
    tooltip
      .select("#temp")
      .style("color", colorScale(varianceAccessor(d) + baseTemperature))
      .html(
        `${d3.format(".2f")(varianceAccessor(d) + baseTemperature)} &deg;C`
      );
    tooltip
      .select("#variance")
      .html(
        `${varianceAccessor(d) > 0 ? "+" : ""}${d3.format(".2f")(
          varianceAccessor(d)
        )} &deg;C`
      );

    const x = xScale(xAccessor(d)) + cellSize / 2 + dimensions.margin.left;
    const y = yScale(yAccessor(d)) + dimensions.margin.top;
    tooltip
      .attr("data-year", d.year)
      .style("transform", `translate(calc(${x}px - 50%), calc(${y}px - 100%))`)
      .style("opacity", 1);
  }
  function onMouseLeave() {
    tooltip.style("opacity", 0);
  }

  days.on("mouseenter", onMouseEnter).on("mouseleave", onMouseLeave);
}

drawHeatmap();
