// write your code here!
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
  }, [])
}

d3.select('form')
  .on('submit', (event) => {
    event.preventDefault();
    const input = d3.select('input');
    const phrase = input.property('value');
    const data = getData(phrase);

    const letters = d3.select('#letters').selectAll('.letter')
      .data(data, d => d.character);

      letters
        .classed('new', false)
        .exit().remove();

      letters.enter()
        .append('div')
        .classed('letter', true)
        .classed('new', true)
      .merge(letters)
        .text(d => d.character)
        .style('width', '20px')
        .style('height', d => `${d.count * 20}px`)
        .style('line-height', '20px')
        .style('margin-right', '5px')

    d3.select('#phrase')
      .text(`Analysis of: "${phrase}"`)

    d3.select('#count')
      .text(`(New characters: ${letters.enter().nodes().length})`);

    input.property('value', '');
  });

d3.select('#reset').on('click', () => {
  d3.selectAll('.letter').remove();
  d3.select('#phrase').text('');
  d3.select('#count').text('');
})
