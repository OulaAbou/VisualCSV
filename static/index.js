const svg = d3.select('.canva svg');
const svg2 = d3.select('.new-container div svg');

let allData = [];
let allInspectedData = [];

// Function to create visualization
function createVisualization(data) {
    allData = allData.concat(data); // Combine new data with existing data

    // Join the data to rects
    const rects = svg.selectAll('rect')
        .data(allData);

    // Add attrs to rects already in the DOM
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.fill)
        .on('click', (event, d) => handleClick(d.data));  // Pass the necessary data

    // Append the enter selection to the DOM
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', ( d) => handleClick(d.data));  // Pass the necessary data

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}

function handleClick(data) {
    // Update allInspectedData with new data
    allInspectedData = data;

    const rectHeight = 20;  // Example height for each rect
    const rectWidth = 100;  // Example width for each rect
    const padding = 5;      // Padding between rects

    const rects = svg2.selectAll('rect')
        .data(allInspectedData);

    // Update existing rects
    rects.attr('y', (d, i) => i * (rectHeight + padding)) 
        .attr('x', 10)  // Fixed x value for all rects
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .attr('fill', d => d.color);

    // Append new rects for enter selection
    rects.enter()
        .append('rect')
            .attr('y', (d, i) => i * (rectHeight + padding))
            .attr('x', 10)  // Fixed x value for all rects
            .attr('height', rectHeight)
            .attr('width', rectWidth)
            .attr('fill', d => d.color);

    // Remove rects that are no longer in the data
    rects.exit().remove();

    // Update the height of the svg2 container
    const totalHeight = allInspectedData.length * (rectHeight + padding);
    svg2.attr('height', totalHeight);
}

// Ensure the button is selected and the event listener is attached correctly
document.addEventListener('DOMContentLoaded', () => {
    const button = d3.select('.fetch-button');
    
    button.on('click', () => {
        const fileName = 'top_1000_films.csv';
        fetch(`/get_data?file=${fileName}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    createVisualization(data);
                }
            });
    });
});
