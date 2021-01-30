//* Create outer pie chart for birth data on a given year, grouped by month
const minYear = d3.min(birthData, d => d.year);
const maxYear = d3.max(birthData, d => d.year);
const width = 600;
const height = 600;

const months = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"];

const monthsColorScale = d3.scaleOrdinal()
  .domain(months)
  .range(d3.schemeSet3);

const quartersColorScale = d3.scaleOrdinal()
  .domain(["1st", "2nd", "3rd", "4th"])
  .range(d3.schemeSet3.filter((e, i) => i % 3 === 2));

// Center the pie chart within the SVG
const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`)
  .classed("months-chart", true);

svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`)
  .classed("quarters-chart", true);

svg.append("text")
  .classed("title", true)
  .attr("x", width / 2)
  .attr("y", 30)
  .attr("font-size", "2em")
  .attr("text-anchor", "middle");

function updateMonths(currentYear) {
  const monthsData = birthData.filter(d => d.year === currentYear);

  const monthsArcs = d3.pie()
    .value(d => d.births)
    .sort((a, b) => (
      months.indexOf(a.month) - months.indexOf(b.month)
    ))(monthsData);

  const monthsPath = d3.arc()
    .outerRadius(width / 2 - 40)
    .innerRadius(width / 4);

  const monthsChart = d3.select(".months-chart")
    .selectAll(".months-group")
    .data(monthsArcs);

  // The number of arcs (i.e months) actually stays the same,
  // so we won't need to deal with exit selections for these particular graphs!
  //! monthsChart.exit().remove();

  const g = monthsChart
    .enter()
    .append("g")
    .classed("months-group", true);

  g.append("path");
  g.append("text");

  g.merge(monthsChart)
    .select("path")
      .classed("arc", true)
      .attr("fill", d => monthsColorScale(d.data.month))
      .attr("stroke", "black")
      .attr("d", monthsPath);

  const text = g.merge(monthsChart)
    .select("text")
      .text("")
      .attr("transform", d => `translate(${monthsPath.centroid(d)})`)

  text.append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(d => d.data.month.slice(0, 3));
  text.append("tspan")
    .attr("x", 0)
    .attr("y", "1.2em")
    .attr("text-anchor", "middle")
    .text(d => d.data.births);

  d3.select(".title")
    .text(`Births by month and quarter for ${currentYear}`);

  updateQuarters(monthsData);
}

//* Create inner pie chart that groups data by quarter instead
const ordinalRules = new Intl.PluralRules("en", {type: "ordinal"});
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th"
};

const qScale = d3.scaleLinear().domain([0, 12]).rangeRound([1,4]);
function chunk(arr, size) {
  return arr.reduce((acc, e, i) => {
    if (i % size) {
      acc[acc.length - 1].births += e.births;
    } else {
      const quarter = qScale(i + 1);
      acc.push({
        year: e.year,
        quarter: `${quarter}${suffixes[ordinalRules.select(quarter)]}`,
        births: e.births
      });
    }
    return acc;
  }, []);
}

function updateQuarters(monthsData) {
  let quartersData = chunk(monthsData, 3);

  const quartersArcs = d3.pie()
  .value(d => d.births)
  .sort((a,b) => (
    a.quarter - b.quarter
  ))(quartersData);

  const quartersPath = d3.arc()
    .outerRadius(width / 4)
    .innerRadius(0);

  const quartersChart = d3.select(".quarters-chart")
    .selectAll(".quarters-group")
    .data(quartersArcs);

  // The number of arcs (i.e quarters) actually stays the same,
  // so we won't need to deal with exit selections for these particular graphs!
  //! quartersChart.exit().remove();

  const g = quartersChart
    .enter()
    .append("g")
    .classed("quarters-group", true);

  g.append("path");
  g.append("text");

  g.merge(quartersChart)
    .select("path")
      .classed("arc", true)
      .attr("fill", d => quartersColorScale(d.data.quarter))
      .attr("stroke", "black")
      .attr("d", quartersPath);

  const text = g.merge(quartersChart)
    .select("text")
      .text("")
      .attr("transform", d => `translate(${quartersPath.centroid(d)})`)

  text.append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(d => `${d.data.quarter} Qtr.`);
  text.append("tspan")
    .attr("x", 0)
    .attr("y", "1.2em")
    .attr("text-anchor", "middle")
    .text(d => d.data.births);
}

// Initialize the charts
updateMonths(minYear);

//* Create range input to adjust the year
d3.select("input")
  .property("min", minYear)
  .property("max", maxYear)
  .property("value", minYear)
  .on("input", event => updateMonths(+event.target.value));