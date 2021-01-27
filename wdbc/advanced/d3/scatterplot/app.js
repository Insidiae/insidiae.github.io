const width = 600;
const height = 600;
const padding = 50;
const svg = d3.select('svg')
              .attr('width', width)
              .attr('height', height);

const filteredRegionData = regionData.filter(d => d.subscribersPer100 && d.adultLiteracyRate && d.medianAge && d.urbanPopulationRate)

const xScale = d3.scaleLinear()
    .domain(d3.extent(filteredRegionData, d => d.adultLiteracyRate))
    .range([padding, width - padding]);
const yScale = d3.scaleLinear()
    .domain(d3.extent(filteredRegionData, d => d.subscribersPer100))
    .range([height - padding, padding]);
const colorScale = d3.scaleLinear()
    .domain(d3.extent(filteredRegionData, d => d.urbanPopulationRate))
    .range(['green', 'blue']);
const radiusScale = d3.scaleLinear()
    .domain(d3.extent(filteredRegionData, d => d.medianAge))
    .range([5, 30]);

const xAxis = d3.axisBottom(xScale)
    .tickSize(-height + 2 * padding);
const yAxis = d3.axisLeft(yScale)
    .tickSize(-width + 2 * padding);

svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

svg.selectAll('circle')
.data(filteredRegionData)
.enter()
.append('circle')
  .attr('cx',d => xScale(d.adultLiteracyRate))
  .attr('cy',d =>  yScale(d.subscribersPer100))
  .attr('r', d => radiusScale(d.medianAge))
  .attr('fill', d => colorScale(d.urbanPopulationRate))
  .attr('stroke', '#fff');

svg.append('text')
  .attr('x', width / 2)
  .attr('y', height - padding)
  .attr('dy', padding / 2)
  .style('text-anchor', 'middle')
  .text('Literacy Rate, Aged 15 and Up');

svg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height / 2)
  .attr('dy', padding / 2)
  .style('text-anchor', 'middle')
  .text('Cellular Subscribers per 100 People');

svg.append('text')
  .attr('x', width / 2)
  .attr('dy', '1em')
  .style('text-anchor', 'middle')
  .style('font-size', '1.5em')
  .text('Cellular Subscriptions vs. Literacy Rate');
