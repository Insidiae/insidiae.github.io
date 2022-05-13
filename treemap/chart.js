async function drawTreemap({ title, description, url }) {
  //* Step 1. Access data
  const dataset = await d3.json(url);

  const nameAccessor = (d) => d.data.name;
  const categoryAccessor = (d) => d.data.category;
  const valueAccessor = (d) => +d.value;

  //* Step 2. Create chart dimensions
  const width = Math.max(960, window.innerWidth * 0.85);
  const dimensions = {
    width,
    boundedHeight: 0.625 * width,
    margin: {
      top: 10,
      right: 10,
      bottom: 64,
      left: 10,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  const legendWidth = dimensions.boundedWidth;
  const legendDimensions = {
    width: legendWidth,
    height: 0.3 * legendWidth,
    cellSize: 25,
    columnSize: 175,
    rowGap: 25,
  };

  dimensions.height =
    dimensions.boundedHeight +
    dimensions.margin.top +
    dimensions.margin.bottom +
    legendDimensions.height;

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

  const clipPath = bounds
    .append("defs")
    .append("clipPath")
    .attr("id", "bounds-clip-path")
    .append("rect")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight);

  const clip = bounds.append("g").attr("clip-path", "url(#bounds-clip-path)");

  //* Step 4. Create scales
  const root = d3
    .hierarchy(dataset)
    .eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum((d) => valueAccessor(d) || 0)
    //? sort descending by height and value
    .sort(
      (current, next) =>
        next.height - current.height || next.value - current.value
    );

  const leaves = root.leaves();

  const allCategories = new d3.InternSet(
    leaves.map((d) => categoryAccessor(d))
  );

  const colorScale = d3
    .scaleOrdinal()
    .domain(allCategories)
    .range(schemeCategory20);

  //* Step 5. Draw data
  const tilingMethod = d3.treemapSquarify;
  const treemap = d3
    .treemap()
    .tile(tilingMethod)
    .size([dimensions.boundedWidth, dimensions.boundedHeight])
    .paddingInner(1);

  treemap(root);

  const tileGroup = clip
    .selectAll("g")
    .data(leaves)
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  const tileRect = tileGroup
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => nameAccessor(d))
    .attr("data-category", (d) => categoryAccessor(d))
    .attr("data-value", (d) => valueAccessor(d))
    .attr("fill", (d) => colorScale(categoryAccessor(d)))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  const tileText = tileGroup
    .append("text")
    .selectAll("tspan")
    //? Split the name into separate words
    .data((d) => nameAccessor(d).split(/(?=[A-Z][^A-Z])/g))
    .join("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 16 + i * 10)
    .attr("font-size", "0.6em")
    .text((d) => d);

  //* Step 6. Draw peripherals
  d3.select("#title").text(title);
  d3.select("#description").text(description);

  const legendItemsPerRow = Math.floor(
    legendDimensions.width / legendDimensions.columnSize
  );
  const legend = wrapper
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${
        dimensions.boundedHeight + dimensions.margin.bottom
      })`
    );

  const legendItem = legend
    .selectAll("g")
    .data(allCategories)
    .join("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(${(i % legendItemsPerRow) * legendDimensions.columnSize}, ${
          Math.floor(i / legendItemsPerRow) * legendDimensions.cellSize +
          legendDimensions.rowGap * Math.floor(i / legendItemsPerRow)
        })`
    );

  legendItem
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", legendDimensions.cellSize)
    .attr("height", legendDimensions.cellSize)
    .attr("fill", (d) => colorScale(d));

  legendItem
    .append("text")
    .attr("x", legendDimensions.cellSize + 10)
    .attr("y", legendDimensions.cellSize)
    .text((d) => d);

  //* Step 7. Set up interactions
  const tooltip = d3.select("#tooltip");

  function onMouseEnter(event, d) {
    tooltip.select("#name").text(nameAccessor(d));
    tooltip.select("#category").text(categoryAccessor(d));
    tooltip.select("#value").text(valueAccessor(d));

    const x = d.x0 + (d.x1 - d.x0) / 2;
    const y = d.y0;

    tooltip
      .attr("data-value", valueAccessor(d))
      .style("opacity", 1)
      .style("transform", `translate(calc(${x}px - 50%), calc(${y}px - 100%))`);
  }

  function onMouseLeave() {
    tooltip.attr("data-value", null).style("opacity", 0);
  }

  tileGroup.on("mouseenter", onMouseEnter).on("mouseleave", onMouseLeave);
}

//* Recreate d3.schemeCategory20
const schemeCategory20 = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5",
].map((color) => d3.interpolateRgb(color, "#fff")(0.2));

// 💯 Extra Credit: Add a way to toggle between these three datasets
const sources = {
  kickstarter: {
    title: "Kickstarter Pledges",
    description:
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  },
  movie: {
    title: "Movie Sales",
    description: "Top 100 Highest Grossing Movies Grouped By Genre",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  },
  videogame: {
    title: "Video Game Sales",
    description: "Top 100 Most Sold Video Games Grouped by Platform",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  },
};

drawTreemap(sources.videogame);
