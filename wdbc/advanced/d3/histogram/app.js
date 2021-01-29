// write your code here!
const width = 800;
const height = 600;
const barPadding = 1;
const padding = 50;
const ageData = regionData.filter(d => !!d.medianAge)

const xScale = d3.scaleLinear()
.domain(d3.extent(ageData, d => d.medianAge))
.rangeRound([padding, width - padding]);

const histogram = d3.histogram()
  .domain(xScale.domain())
  .thresholds(xScale.ticks())
  .value(d => d.medianAge);

let bins = histogram(ageData);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(bins, d => d.length)])
  .range([height - padding, padding]);

const initialBinCount = bins.length;


const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

svg.append('g')
  .attr('transform', `translate(0, ${height - padding})`)
  .classed("x-axis", true)
  .call(d3.axisBottom(xScale));

svg.append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .style("text-anchor", "middle")
  .text("Median Age")

svg.append('g')
  .attr('transform', `translate(${padding}, 0)`)
  .classed("y-axis", true)
  .call(d3.axisLeft(yScale));

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", 15)
  .style("text-anchor", "middle")
  .text("Frequency");

function updateBars(binCount) {
  histogram.thresholds(xScale.ticks(binCount));
  bins = histogram(ageData);
  yScale.domain([0, d3.max(bins, d => d.length)]);

  d3.select(".x-axis")
    .call(d3.axisBottom(xScale)
      .ticks(binCount))
    .selectAll("text")
    .attr("x", 10)
    .attr("y", -3)
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  d3.select(".y-axis")
    .call(d3.axisLeft(yScale));

  const bars = svg
    .selectAll(".bar")
    .data(bins);

  bars.exit().remove();

  let g = bars
    .enter()
    .append("g")
      .classed("bar", true);

  g.append("rect");
  g.append("text");

  g.merge(bars)
    .select("rect")
      .attr("x", (d, i) => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => {
        const barWidth = xScale(d.x1) - xScale(d.x0) - barPadding
        return barWidth > 0 ? barWidth : 0;
      })
      .attr("height", d => height - padding - yScale(d.length))
      .attr("fill", "#588dfd");

  g.merge(bars)
    .select("text")
      .text(d => `Median ages ${d.x0} - ${d.x1} (${d.length})`)
      .attr("transform", "rotate(-90)")
      .attr("y", d => (xScale(d.x1) + xScale(d.x0))/2)
      .attr("x", -height + padding + 10)
      .style("alignment-baseline", "middle")
      .style("font-size", d => `${Math.min(xScale(d.x1) - xScale(d.x0) - barPadding * 2, 48)}px`);

  d3.select(".bin-count")
    .text(`Number of bins: ${bins.length}`);
}

updateBars(initialBinCount);

d3.select("input")
  .property("value", initialBinCount)
  .on("input", event => updateBars(+event.target.value));