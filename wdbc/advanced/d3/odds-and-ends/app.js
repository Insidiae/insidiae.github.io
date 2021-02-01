//* Get data from the CSV data files
async function getData() {
  try {
    const co2Request = d3.csv("data/co2/API_EN.ATM.CO2E.KT_DS2_en_csv_v2.csv", formatter);
    const methaneRequest = d3.csv("data/methane/API_EN.ATM.METH.KT.CE_DS2_en_csv_v2.csv", formatter);
    const renewableRequest = d3.csv("data/renewable/API_EG.FEC.RNEW.ZS_DS2_en_csv_v2.csv", formatter);
    const populationRequest = d3.csv("data/population/API_SP.POP.TOTL_DS2_en_csv_v2.csv", formatter);
    const urbanRequest = d3.csv("data/urban_population/API_SP.URB.TOTL_DS2_en_csv_v2.csv", formatter);

    const data = await Promise.all([co2Request, methaneRequest, renewableRequest, populationRequest, urbanRequest]);

    const yearObj = formatAllData(data);

    return yearObj;
  } catch (error) {
    console.error("Something went wrong with your request:", error);
  }
}

//* Formatter function to interpret the incoming CSV data
function formatter(row) {
  const invalidRows = [
    "Arab World",
    "Central Europe and the Baltics",
    "Caribbean small states",
    "East Asia & Pacific (excluding high income)",
    "Early-demographic dividend",
    "East Asia & Pacific",
    "Europe & Central Asia (excluding high income)",
    "Europe & Central Asia",
    "Euro area",
    "European Union",
    "Fragile and conflict affected situations",
    "High income",
    "Heavily indebted poor countries (HIPC)",
    "IBRD only",
    "IDA & IBRD total",
    "IDA total",
    "IDA blend",
    "IDA only",
    "Not classified",
    "Latin America & Caribbean (excluding high income)",
    "Latin America & Caribbean",
    "Least developed countries: UN classification",
    "Low income",
    "Lower middle income",
    "Low & middle income",
    "Late-demographic dividend",
    "Middle East & North Africa",
    "Middle income",
    "Middle East & North Africa (excluding high income)",
    "North America",
    "OECD members",
    "Other small states",
    "Pre-demographic dividend",
    "Pacific island small states",
    "Post-demographic dividend",
    "Sub-Saharan Africa (excluding high income)",
    "Sub-Saharan Africa",
    "Small states",
    "East Asia & Pacific (IDA & IBRD countries)",
    "Europe & Central Asia (IDA & IBRD countries)",
    "Latin America & the Caribbean (IDA & IBRD countries)",
    "Middle East & North Africa (IDA & IBRD countries)",
    "South Asia (IDA & IBRD)",
    "Sub-Saharan Africa (IDA & IBRD countries)",
    "Upper middle income",
    "World"
  ];
  const obj = {
    region: row["Country Name"],
    indicator: row["Indicator Name"]
  }
  if (invalidRows.indexOf(obj.region) > -1) return;
  for (const key in row) {
    if (parseInt(key)) obj[key] = +row[key] || null;
  }
  return obj;
}

//* Combine CSV data into a single object with data sorted by year
function formatAllData(data) {
  const yearObj = {};
  data.forEach(function(arr) {
    // get the indicator and format the key
    const indicator = arr[0].indicator.split(" ")[0].replace(",","").toLowerCase();
    arr.forEach(function(obj) {
      // get current region
      const region = obj.region;
      // parse through every year, add that region"s data to that year array
      for (const year in obj) {
        if (parseInt(year)) {
          if (!yearObj[year]) yearObj[year] = [];
          const yearArr = yearObj[year];
          const regionObj = yearArr.find(el => el.region === region);
          if (regionObj) regionObj[indicator] = obj[year];
          else {
            const newObj = {region: region};
            newObj[indicator] = obj[year];
            yearArr.push(newObj);
          }
        }
      }
    })
  });
  // remove years that don"t have complete data sets for any region
  for (const year in yearObj) {
    yearObj[year] = yearObj[year].filter(validRegion);
    if (yearObj[year].length === 0) delete yearObj[year];
  }
  return yearObj;
}

//* Checks if region has complete data set
function validRegion(d) {
  for (const key in d) {
    if (d[key] === null) return false;
  }
  return true;
}

//* Set inital state for chart
async function initialize() {
  try {
    const width = 700;
    const height = 700;
    const padding = 100;
    const yearObj = await getData();
    const [minYear, maxYear] = d3.extent(Object.keys(yearObj).map(year => +year));

    const svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g")
      .attr("transform", `translate(0, ${width - padding + 30})`)
      .classed("x-axis", true);

    svg.append("g")
      .attr("transform", `translate(${padding - 30}, 0)`)
      .classed("y-axis", true);

    svg.append("text")
      .text("CO2 Emissions (kt per person)")
      .attr("x", width / 2)
      .attr("y", height)
      .attr("dy", "-1.5em")
      .attr("text-anchor", "middle");

    svg.append("text")
      .text("Methane Emissions (kt of CO2 equivalent per person)")
      .attr("transform", "rotate(-90)")
      .attr("x", - width / 2)
      .attr("y", "1.5em")
      .attr("text-anchor", "middle");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", "2em")
      .attr("text-anchor", "middle")
      .style("font-size", "1.5em")
      .classed("title", true);

    d3.select("input")
      .property("min", minYear)
      .property("max", maxYear)
      .property("value", minYear)
      .on("input", event => drawPlot(+event.target.value));

    drawPlot(minYear);

    //* Draw scatterplot for a given year using general update pattern
    function drawPlot(year) {
      const data = yearObj[year];
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.co2 / d.population))
        .range([padding, width - padding]);

      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.methane / d.population))
        .range([height - padding, padding]);

      const fScale = d3.scaleLinear()
        .domain([0, 100])
        .range(["black", "#4ffe45"]);

      const rScale = d3.scaleLinear()
        .domain([0, 1])
        .range([5, 30]);

      d3.select(".x-axis")
        .call(d3.axisBottom(xScale));

      d3.select(".y-axis")
        .call(d3.axisLeft(yScale));

      d3.select(".title")
        .text(`Methane vs. CO2 emissions per capita (${year})`);

      const update = svg.selectAll('circle')
        .data(data, d => d.region);

      update.exit()
        .transition()
          .duration(500)
          .attr("r", 0)
        .remove();

      update.enter()
        .append("circle")
          .on("mousemove touchmove", showTooltip)
          .on("mouseout touchout", hideTooltip)
          .attr("cx", d => xScale(d.co2 / d.population))
          .attr("cy", d => yScale(d.methane / d.population))
          .attr("stroke", "white")
          .attr("stroke-width", 1)
        .merge(update)
        .transition()
        .duration(500)
        .delay((d, i) => i * 5)
          .attr("cx", d => xScale(d.co2 / d.population))
          .attr("cy", d => yScale(d.methane / d.population))
          .attr("fill", d => fScale(d.renewable))
          .attr("r", d => rScale(d.urban / d.population));
    }
  } catch (error) {
    console.error("Uh oh, something went wrong:", error);
  }
}

//* self explanatory
function showTooltip(event, d) {
  const tooltip = d3.select(".tooltip");
  tooltip
    .style("opacity", 1)
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY - tooltip.node().offsetHeight / 2}px`)
    .html(`
      <p>Region: ${d.region}</p>
      <p>Methane per capita: ${(d.methane / d.population).toFixed(4)}</p>
      <p>CO2 per capita: ${(d.co2 / d.population).toFixed(4)}</p>
      <p>Renewable energy: ${d.renewable.toFixed(2)}%</p>
      <p>Urban population: ${(d.urban / d.population * 100).toFixed(2)}%</p>
    `);
}

function hideTooltip() {
  d3.select(".tooltip")
    .style("opacity", 0);
}

// Initialize the chart when ready
if (document.readyState != 'loading'){
  initialize();
} else {
  document.addEventListener('DOMContentLoaded', initialize);
}