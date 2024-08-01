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
        .on('click', (d) => handleClick(d.data));  // Pass the necessary data

    // Append the enter selection to the DOM
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', (d) => handleClick(d.data));  // Pass the necessary data

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}

function handleClick(data) {
    // Update allInspectedData with new data
    allInspectedData = data;

    const rectHeight = 20;  // Example height for each rect
    const padding = 5;      // Padding between rects
    const textPadding = 10; // Padding around text inside the rectangle

    // Calculate the center x position for the rectangles
    const containerWidth = svg2.node().getBoundingClientRect().width;

    // Create a dummy text element to measure text width
    const dummyText = svg2.append('text')
        .attr('font-size', '12px')
        .attr('visibility', 'hidden');

    // Update rectangles
    const rects = svg2.selectAll('rect')
        .data(allInspectedData);

    // Compute width based on text length
    allInspectedData.forEach(d => {
        dummyText.text(d.value);
        const textWidth = dummyText.node().getBBox().width;
        d.width = textWidth + 2 * textPadding; // Adjust width for padding
    });

    // Remove dummy text element
    dummyText.remove();

    // Update existing rects
    rects.attr('y', (d, i) => i * (rectHeight + padding)) 
        .attr('x', d => (containerWidth - d.width) / 2)  // Center horizontally based on dynamic width
        .attr('height', rectHeight)
        .attr('width', d => d.width)  // Set width based on text length
        .attr('fill', d => d.color);

    // Append new rects for enter selection
    rects.enter()
        .append('rect')
            .attr('y', (d, i) => i * (rectHeight + padding)) 
            .attr('x', d => (containerWidth - d.width) / 2)  // Center horizontally based on dynamic width
            .attr('height', rectHeight)
            .attr('width', d => d.width)  // Set width based on text length
            .attr('fill', d => d.color);

    // Remove rects that are no longer in the data
    rects.exit().remove();

    // Update the height of the svg2 container
    const totalHeight = allInspectedData.length * (rectHeight + padding);
    svg2.attr('height', totalHeight);

    // Update text elements
    const texts = svg2.selectAll('text')
        .data(allInspectedData);

    // Update existing text elements
    texts.attr('x', d => (containerWidth - d.width) / 2 + d.width / 2)  // Center text horizontally based on dynamic width
        .attr('y', (d, i) => i * (rectHeight + padding) + (rectHeight / 2))  // Center vertically
        .attr('dy', '.35em')  // Vertical alignment adjustment
        .text(d => d.value)
        .attr('fill', 'white')  // Text color
        .attr('font-size', '12px')  // Font size
        .attr('text-anchor', 'middle');  // Center text horizontally

    // Append new text elements for enter selection
    texts.enter()
        .append('text')
            .attr('x', d => (containerWidth - d.width) / 2 + d.width / 2)  // Center text horizontally based on dynamic width
            .attr('y', (d, i) => i * (rectHeight + padding) + (rectHeight / 2))  // Center vertically
            .attr('dy', '.35em')  // Vertical alignment adjustment
            .text(d => d.value)
            .attr('fill', 'white')  // Text color
            .attr('font-size', '12px')  // Font size
            .attr('text-anchor', 'middle');  // Center text horizontally

    // Remove text elements that are no longer in the data
    texts.exit().remove();
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
