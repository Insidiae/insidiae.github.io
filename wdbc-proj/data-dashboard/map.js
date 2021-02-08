//* II. Make Map
// setup the map SVG
function createMap(width, height) {
  d3.select("#map")
    .attr("width", width)
    .attr("height", height)
  .append("text")
    .attr("x", width / 2)
    .attr("y", "1em")
    .attr("font-size", "1.5em")
    .style("text-anchor", "middle")
    .classed("map-title", true);
}

// draw the map
function drawMap(geoData, climateData, year, dataType) {
  // set up Mercator Projecttion
  const map = d3.select("#map");

  const projection = d3.geoMercator()
    .scale(110)
    .translate([
      +map.attr("width") / 2,
      +map.attr("height") / 1.4
    ]);

  const path = d3.geoPath()
    .projection(projection);

  // join the climate data to the map data
  geoData.forEach(d => {
    // climate data and map data use the same ID for country code,
    // so we can filter the climate data for countries
    // whose country code matches the map data feature ID
    const countries = climateData.filter(row => row.countryCode === d.id);
    let name = "";
    if(countries.length > 0) name = countries[0].country;

    // set the map data's properties key to:
    // the climate data for current year (if it exists)
    // or a simple object (if no climate data exists for the current year)
    d.properties = countries.find(country => country.year === year) || { country: name }
  })

  // set up the color scale for the data to be displayed
  const colors = ["#fdfd58", "#fdab58", "#fd6735", "#fc0303"];

  //! NOTE: it might be better to get the min/max values for the scales programatically,
  //! and/or to use a logarithmic/power scale instead of a linear scale,
  //! but to keep things simple we stick to using a linear scale for this project.
  const domains = {
    emissions: [0, 2.5e5, 1e6, 5e6],
    emissionsPerCapita: [0, 0.5, 2, 10],
  };

  const mapColorScale = d3.scaleLinear()
    .domain(domains[dataType])
    .range(colors);

  // Use the General Update Pattern to display the data
  const update = map.selectAll(".country")
    .data(geoData);

  // 1. Remove elements in the exit selection
  //! We won't have an exit selection here, so proceed to the next step!

  // 2. Append a new path element for each new data
  update.enter()
    .append("path")
      .classed("country", true)
      .attr("d", path)
      // Draw bar chart when a country is clicked
      .on("click", function() {
        // get current data type *at the time when the country is clicked*
        const currentDataType = d3.select("input:checked")
          .property("value");
        // if country is not currently active, draw bar chart
        // otherwise, remove bar chart elements
        const country = d3.select(this);
        const isActive = country.classed("active");
        const countryName = isActive ? "" : country.data()[0].properties.country;
        drawBar(climateData, currentDataType, countryName);
        highlightBars(+d3.select("#year").property("value"));

        // remove active class on all other countries
        // and toggle active class on the clicked country
        d3.selectAll(".country")
          .classed("active", false)
        country.classed("active", !isActive);
      })
  // 3a. update the fill color for existing data
    .merge(update)
      .transition()
      .duration(750)
      .attr("fill", d => {
        // display the appropriate color according to the color scale
        // or just display a gray color if there's no data
        const val = d.properties[dataType];
        return val ? mapColorScale(val) : "#ccc"
      });

  // 3b. update the graph title
  d3.select(".map-title")
    .text(`Carbon dioxide ${getGraphTitle(dataType)}, ${year}`);
}

function getGraphTitle(dataType) {
  return dataType.replace(/[A-Z]/g, c => " " + c.toLowerCase());
}