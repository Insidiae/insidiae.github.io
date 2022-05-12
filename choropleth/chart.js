async function drawMap() {
  //* Step 1. Access data
  const topoDataRequest = d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  );
  const datasetRequest = d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  );

  const [topoData, dataset] = await Promise.all([
    topoDataRequest,
    datasetRequest,
  ]);

  const countyShapes = topojson.feature(topoData, topoData.objects.counties);

  const countyIdAccessor = (county) => county.id;
  //? Map the dataset fips to the county ids
  const dataAccessor = (county) => dataset.find((d) => d.fips === county.id);

  const bachelorsAccessor = (d) => d.bachelorsOrHigher;
  const countyFullNameAccessor = (d) => `${d.area_name}, ${d.state}`;

  //* Step 2. Create chart dimensions
  // const width = Math.max(window.innerWidth * 0.9, 1000);
  const dimensions = {
    width: 960,
    height: 600,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const pathGenerator = d3.geoPath();

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
  const [educationMin, educationMax] = d3.extent(dataset, bachelorsAccessor);
  const step = 8;
  const domain = d3.range(
    educationMin,
    educationMax,
    (educationMax - educationMin) / step
  );
  const colorScale = d3
    .scaleThreshold()
    .domain(domain)
    .range(d3.schemeGreens[9]);

  //* Step 5. Draw data
  const counties = bounds
    .selectAll(".county")
    .data(countyShapes.features)
    .join("path")
    .attr("class", "county")
    .attr("data-fips", (county) => countyIdAccessor(county))
    .attr("data-education", (county) => bachelorsAccessor(dataAccessor(county)))
    .attr("d", pathGenerator)
    .attr("fill", (county) =>
      colorScale(bachelorsAccessor(dataAccessor(county)) || 0)
    );

  //* Step 6. Draw peripherals
  const mesh = bounds
    .append("path")
    .datum(topojson.mesh(topoData, topoData.objects.states, (a, b) => a !== b))
    .attr("class", "states")
    .attr("d", pathGenerator);

  const legendGroup = wrapper
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${(2 * dimensions.width) / 3}, ${dimensions.margin.top / 2})`
    );

  const legendWidth = 250;
  const legendHeight = 16;
  const legendScale = d3
    .scaleLinear()
    .domain([educationMin, educationMax])
    .rangeRound([0, legendWidth]);

  const legendAxisGenerator = d3
    .axisBottom(legendScale)
    .tickFormat((x) => `${d3.format(".0f")(x)}%`)
    .tickSize(legendHeight)
    .tickValues(colorScale.domain());

  legendGroup
    .selectAll("rect")
    .data(
      colorScale.range().map((color) => {
        const [start, end] = colorScale.invertExtent(color);

        //? invertExtent() returns undefined for the leftmost and rightmost values
        //? (i.e. the start value for the first color
        //? or the end value for the last color), so just replace those
        //? with either educationMin or educationMax, respectively
        return [start ?? educationMin, end ?? educationMax];
      })
    )
    .enter()
    .append("rect")
    .attr("height", legendHeight)
    .attr("x", (d) => legendScale(d[0]))
    .attr("width", (d) => legendScale(d[1]) - legendScale(d[0]))
    .attr("fill", (d) => colorScale(d[0]));

  legendGroup
    .append("g")
    .call(legendAxisGenerator)
    //? We only want the tick marks, not the axis line
    .selectAll(".domain")
    .remove();

  //* Step 7. Set up interactions
  const tooltip = d3.select("#tooltip");

  function onMouseEnter(event, county) {
    const d = dataAccessor(county);

    tooltip.select("#county").text(countyFullNameAccessor(d));
    tooltip
      .select("#value")
      .text(`${d3.format(",.2f")(bachelorsAccessor(d) || 0)}%`);

    const [centerX, centerY] = pathGenerator.centroid(county);
    const x = centerX + dimensions.margin.left;
    const y = centerY + dimensions.margin.top;

    tooltip
      .style("opacity", 1)
      .attr("data-education", bachelorsAccessor(d))
      .style("transform", `translate(calc(${x}px - 50%), calc(${y}px - 100%))`);
  }

  function onMouseLeave() {
    tooltip.attr("data-education", null).style("opacity", 0);
  }

  counties.on("mouseenter", onMouseEnter).on("mouseleave", onMouseLeave);
}

drawMap();
