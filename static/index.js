const svg = d3.select('.container .canva svg');
const svg2 = d3.select('.container .new-container div svg');

let allData = [];
let allInspectedData = [];
let columnsData = [];
let inspectedColumnsData = [];

// Define drag behavior
const dragHandler = d3.drag()
    .on('start', function (event, d) {
        d3.select(this).raise().attr('stroke', 'black');
    })
    .on('drag', function (event, d) {
        // Update data to reflect new position
        d.x = event.x;
        d.y = event.y;

        // Move the dragged rectangle
        d3.select(this)
            .attr('x', d.x)
            .attr('y', d.y);
    })
    .on('end', function (event, d) {
        d3.select(this).attr('stroke', null);
    });

// Function to create visualization (updated to include drag functionality)
function createVisualization(data) {
    allData = allData.concat(data); // Combine new data with existing data

    // Join the data to rects, using a unique key (e.g., 'id')
    const rects = svg.selectAll('rect')
        .data(allData, d => d.id);  // Ensure there's a unique key like 'id'

    // Update existing rects
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.fill)
        .on('click', (event, d) => handleClick(d.data))  // Pass the necessary data
        .call(dragHandler); // Attach drag behavior

    // Append new rects for the enter selection
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', (event, d) => handleClick(d.data))  // Pass the necessary data
            .call(dragHandler); // Attach drag behavior

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}


// Function to handle click (same as before)
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

function createColumnVisualization(data) {
    columnsData = columnsData.concat(data); // Combine new data with existing data

    // Function to handle right-click
    function handleRightClick(event, d) {
        event.preventDefault(); // Prevent the default context menu

        // Remove any existing context menu
        d3.select('.context-menu').remove();

        // Create and position the context menu
        const contextMenu = d3.select('body')
            .append('div')
            .attr('class', 'context-menu')
            .style('position', 'absolute')
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY}px`)
            .style('background-color', 'white')
            .style('border', '1px solid black')
            .style('padding', '5px');

        // Add menu items
        const menuItems = ['Action 1', 'Action 2', 'Action 3'];
        contextMenu.selectAll('div')
            .data(menuItems)
            .enter()
            .append('div')
            .text(item => item)
            .style('cursor', 'pointer')
            .on('click', function(item) {
                console.log(`Clicked ${item} for data:`, d);
                contextMenu.remove(); // Remove the menu after clicking
            });

        // Close the menu when clicking outside
        d3.select('body').on('click.context-menu', () => {
            contextMenu.remove();
        });
    }

    // Join the data to rects
    const rects = svg.selectAll('rect')
        .data(columnsData);

    // Add attrs to rects already in the DOM
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.fill)
        .on('click', (event, d) => handleColumnClick(d.data))  // Pass the necessary data
        .on('contextmenu', handleRightClick)  // Add right-click event
        .call(dragHandler); // Attach drag behavior

    // Append the enter selection to the DOM
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', (event, d) => handleColumnClick(d.data))  // Pass the necessary data
            .on('contextmenu', handleRightClick)  // Add right-click event
            .call(dragHandler); // Attach drag behavior

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}

// New function to handle column click (similar structure to handleClick)
function handleColumnClick(data) {
    // Update inspectedColumnsData with new data
    inspectedColumnsData = data;

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
        .data(inspectedColumnsData);

    // Compute width based on text length
    inspectedColumnsData.forEach(d => {
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
    const totalHeight = inspectedColumnsData.length * (rectHeight + padding);
    svg2.attr('height', totalHeight);

    // Update text elements
    const texts = svg2.selectAll('text')
        .data(inspectedColumnsData);

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

// Ensure the buttons are selected and the event listeners are attached correctly
document.addEventListener('DOMContentLoaded', () => {
    const dataButton = d3.select('#fetch-data');
    const columnsButton = d3.select('#fetch-columns');
    
    dataButton.on('click', () => {
        svg2.selectAll('*').remove();
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

    columnsButton.on('click', () => {
        svg2.selectAll('*').remove();
        const fileName = 'top_1000_films.csv';
        fetch(`/get_columns?file=${fileName}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    createColumnVisualization(data);
                }
            });
    });
});
