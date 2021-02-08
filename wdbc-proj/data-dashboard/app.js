//* I. Fetch data into JS
//* II. Make Map (see map.js)
//* III. Make Pie Chart (see pie.js)
//* IV. Make Bar Chart (see bar.js)
//* V. Show Tooltips
async function initialize() {
  try {
    // fire off requests
    const topoRequest = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
    const dataRequest = d3.csv("./data/all_data.csv", row => {
      return {
        continent: row.Continent,
        country: row.Country,
        countryCode: row["Country Code"],
        emissions: +row.Emissions,
        emissionsPerCapita: +row["Emissions Per Capita"],
        region: +row.Region,
        year: +row.Year,
      };
    });

    // wait for both requests to finish...
    const [topoData, climateData] = await Promise.all([topoRequest, dataRequest]);

    // ...and then sort out the data from both requests
    const [minYear, maxYear] = d3.extent(climateData, d => d.year);
    let currentYear = minYear;
    let currentDataType = d3.select('input[name="data-type"]:checked')
      .attr("value");
    const geoData = topojson.feature(topoData, topoData.objects.countries).features;

    // set up the SVG for the map
    const width = +d3.select(".chart-container")
      .node().offsetWidth;
    const height = 300;

    createMap(width, width * 4 / 5);
    createPie(width, height);
    createBar(width, height);
    drawMap(geoData, climateData, currentYear, currentDataType);
    drawPie(climateData, currentYear);
    drawBar(climateData, currentDataType, "");

    // set up inputs, and listen for input events
    d3.select("#year")
      .property("min", minYear)
      .property("max", maxYear)
      .on("input", event => {
        currentYear = +event.target.value;
        d3.select("#year-val").text(currentYear);
        drawMap(geoData, climateData, currentYear, currentDataType);
        drawPie(climateData, currentYear);
        highlightBars(currentYear);
      });

    d3.selectAll('input[name="data-type"]')
      .on("change", event => {
        const active = d3.select(".active").data()[0];
        const country = active ? active.properties.country : ""
        currentDataType = event.target.value;
        drawMap(geoData, climateData, currentYear, currentDataType);
        drawBar(climateData, currentDataType, country);
      })

    d3.selectAll("svg")
      .on("mousemove touchmove", updateTooltip)
    // Show tooltip
  } catch (error) {
    console.error("Something went wrong with your request:");
    console.error(error);
  }
}

function updateTooltip(event) {
  // Check where the tooltip is supposed to be displayed
  const tooltip = d3.select(".tooltip");
  const tgt = d3.select(event.target);

  const isCountry = tgt.classed("country");
  const isBar = tgt.classed("bar");
  const isArc = tgt.classed("arc");
  // get current data type at the time the event was triggered
  const currentDataType = d3.select("input:checked")
    .property("value");
  const units = currentDataType === "emissions" ?
  "thousand metric tons" :
  "metric tons per capita";

  // access data depending on which graph triggered the event
  let data;
  let continent = ""
  let percentage = "";
  if (isCountry) data = tgt.data()[0].properties;
  if (isArc) {
    data = tgt.data()[0].data;
    continent = `<p>Continent: ${data.continent}</p>`;
    percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
  }
  if (isBar) data = tgt.data()[0];

  // display the tooltip when user hovers over the appropriate graph
  tooltip
    .style("opacity", +(isCountry || isArc || isBar))
    .style("left", `${event.pageX - tooltip.node().offsetWidth / 2}px`)
    .style("top", `${event.pageY - tooltip.node().offsetHeight - 10}px`)
  if(data) {
    const dataValue = data[currentDataType] ?
    `${data[currentDataType].toLocaleString()} ${units}` :
    "Data Not Available";

    tooltip
      .html(`
        <p>Country: ${data.country ? data.country : "Data not Available"}</p>
        ${continent}
        <p>${formatDataType(currentDataType)}: ${dataValue}</p>
        <p>Year: ${data.year || d3.select("#year").property("value")}</p>
        ${percentage}
      `)
  }
}

// format data type text
function formatDataType(key) {
  return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => " " + c);
}

// calculate percentage using atart/end angle values from d3.pie()
function getPercentage(d) {
  const angle = d.endAngle - d.startAngle;
  const fraction = 100 * angle / (Math.PI  * 2);
  return fraction.toFixed(2) + "%";
}

// Initialize the charts when ready
if (document.readyState != 'loading'){
  initialize();
} else {
  document.addEventListener('DOMContentLoaded', initialize);
}