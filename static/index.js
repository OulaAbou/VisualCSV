const svg = d3.select('.canva svg');
const newSvg = d3.select('.new-container svg');

let allData = [];
let clickedData = []; // Track data from clicked rectangles

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
        .on('click', handleCsvRectClick); // Use CSV click handler

    // Append the enter selection to the DOM
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', handleCsvRectClick); // Use CSV click handler

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}

// CSV rect click handler
function handleCsvRectClick(d) {
    console.log(d.data);

    fetch('/post_bar_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d.data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        // Add new data to the visualization
        appendNewData(data.result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to calculate maximum font size
function calculateFontSize(d) {
    const maxFontSize = Math.min(d.width, d.height) * 0.6; // Adjust factor as needed
    return Math.max(10, maxFontSize); // Set a minimum font size
}

// Function to adjust font size to fit within the rectangle
function adjustFontSize(textElement, d) {
    let fontSize = calculateFontSize(d);
    textElement.style('font-size', `${fontSize}px`);

    // Check if text overflows and adjust font size
    let bbox = textElement.node().getBBox();
    while (bbox.width > d.width || bbox.height > d.height) {
        fontSize -= 1; // Reduce font size by 1px
        textElement.style('font-size', `${fontSize}px`);
        bbox = textElement.node().getBBox();
    }
}

// Function to append new data to the existing visualization
function appendNewData(newData) {
    // Clear previous clickedData
    clickedData = newData.map(d => ({...d, isClicked: true})); // Tag new data as clicked

    // Update allData to remove previously clicked data
    allData = allData.filter(d => !d.isClicked).concat(clickedData); // Combine only non-clicked data with new clicked data

    // Join the combined data
    const rects = svg.selectAll('rect')
        .data(allData, d => d.id);

    // Update the attributes of existing rects
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.fill);

    // Append new rects
    rects.enter()
        .append('rect')
            .attr('class', d => d.isClicked ? 'clicked' : '')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', handleCsvRectClick); // Use clicked rect click handler

    // Remove previous clicked rects
    rects.exit().remove();

    // Join the new clicked data for text elements
    const texts = svg.selectAll('text')
        .data(clickedData, d => d.id);

    // Update existing text elements
    texts.attr('x', d => d.x + d.width / 2)
        .attr('y', d => d.y + d.height / 2)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .each(function(d) {
            const textElement = d3.select(this);
            textElement.text(d.value);
            adjustFontSize(textElement, d);
        });

    // Append new text elements
    texts.enter()
        .append('text')
            .attr('x', d => d.x + d.width / 2)
            .attr('y', d => d.y + d.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .each(function(d) {
                const textElement = d3.select(this);
                textElement.text(d.value);
                adjustFontSize(textElement, d);
            });

    // Remove old text elements
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
