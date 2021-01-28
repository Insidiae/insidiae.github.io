// write your code here!
const svgWidth = 800;
const svgHeight = 400;
const barPadding = 10;

const svg = d3.select('svg')
              .attr('width', svgWidth)
              .attr('height', svgHeight);

function getData(phrase) {
  // const data = [];
  // const sorted = phrase.split('').sort();
  // sorted.forEach(char => {
  //   const last = data[data.length - 1]
  //   if(last && last.character === char) last.count++;
  //   else data.push({ character: char, count: 1 })
  // });

  // return data;

  // refactor to use reduce() instead
  return phrase.split("").reduce((data, cur) => {
    const char = data.find(e => e.character === cur);
    if(!char) data.push({character: cur, count: 1});
    else char.count++;
    return data;
  }, []);
}

d3.select('form')
  .on('submit', (event) => {
    event.preventDefault();
    const input = d3.select('input');
    const phrase = input.property('value');
    const data = getData(phrase);

    const barWidth = svgWidth / data.length - barPadding;
    // console.log(barWidth);


    const letters = svg.selectAll('g')
      .data(data, d => d.character);

    letters
      .classed('new', false)
      .exit().remove();

    const letterEnter = letters.enter()
      .append('g')
      .classed('letter', true)
      .classed('new', true);

    letterEnter.append('rect');
    letterEnter.append('text');

    letterEnter.merge(letters)
      .select('rect')
        .attr('width', barWidth)
        .attr('height', d => d.count * 20)
        .attr('x', (d, i) => (barWidth + barPadding) * i)
        .attr('y', (d) => 600 - (d.count * 20));

    letterEnter.merge(letters)
      .select('text')
      .text(d => d.character)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => (barWidth + barPadding) * i + (barWidth / 2))
      .attr('y', (d) => 600 - (d.count * 20));

    d3.select('#phrase')
      .text(`Analysis of: "${phrase}"`);

    d3.select('#count')
      .text(`(New characters: ${letters.enter().nodes().length})`);

    input.property('value', '');
  });

d3.select('#reset').on('click', () => {
  d3.selectAll('.letter').remove();
  d3.select('#phrase').text('');
  d3.select('#count').text('');
})
