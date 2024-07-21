// select the svg container first
const svg = d3.select('svg');

// Function to render data
function renderData(data) {
  // join the data to rects
  const rects = svg.selectAll('rect')
    .data(data);

  // add attrs to rects already in the DOM
  rects.attr('y', d => d.y)
    .attr('x', d => d.x)
    .attr('height', d => d.height)
    .attr('width', d => d.width)
    .attr('fill', d => d.fill);

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('y', d => d.y)
      .attr('x', d => d.x)
      .attr('height', d => d.height)
      .attr('width', d => d.width)
      .attr('fill', d => d.fill);

  // remove any rects that are no longer in the data
  rects.exit().remove();
}



// Load the first JSON file
d3.json('15-16-grid-breakdown.json').then(data1 => {
  // Render the first dataset
  renderData(data1);
});
  
