// Create an SVG element
const svg = d3.select("body").append("svg")
  .attr("width", 300)
  .attr("height", 200);

// Define the pattern
svg.append("defs")
  .append("pattern")
    .attr("id", "stripes")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 10)
    .attr("height", 10)
    .attr("patternTransform", "rotate(45)")
  .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 10)
    .attr("stroke", "black")
    .attr("stroke-width", 5);

// Create a rect with both solid color and stripes
svg.append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 200)
  .attr("height", 100)
  .attr("fill", "url(#stripes)")
  .style("fill-opacity", 0.5)  // This makes the pattern semi-transparent
  .style("stroke", "blue")
  .style("stroke-width", 2);

// Add a solid color underneath
svg.insert("rect", "rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 200)
  .attr("height", 100)
  .attr("fill", "red");