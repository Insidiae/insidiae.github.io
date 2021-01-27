const input = d3.select('input');
const preview = d3.select('.preview');

function setPreview(val) {
  preview
    .classed("hide", val === "")
    .text(val);
}

d3.select('#new-note')
  .on('submit', function(event) {
    event.preventDefault();
    d3.select('#notes')
      .append('p')
        .classed('note', true)
        .text(input.property('value'));
    input.property('value', '');
    setPreview('');
  });

d3.select('.remove')
    .on('click', function() {
      d3.selectAll('.note')
        .remove();
    });

input.on('input', function() {
  // console.log(input.property('value') === "");
  setPreview(input.property('value'));
});

d3.select(".lucky")
  .on("click", function() {
    d3.selectAll(".note")
        .style("font-size", () => `${Math.random() * 100}px`);
  });
