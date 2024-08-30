const svg = d3.select('.container .canva svg');
const svg2 = d3.select('.container .new-container div svg');

let allData = [];
let allInspectedData = [];
let columnsData = [];
let inspectedColumnsData = [];


console.log("D3 version:", d3.version);

// Define drag behavior
const dragHandler = d3.drag()
    .on('start', function (event, d) {
        d3.select(this).raise().attr('stroke', 'gold');
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
    console.log("Received data:", data);  // Debug log

    // Filter out any undefined or null items
    const columnsData = data.filter(item => item != null);

    console.log("Filtered columnsData:", columnsData);  // Debug log

    // Clear previous gradients
    svg.select("defs").remove();

    // Create a `defs` element to hold gradients
    const defs = svg.append("defs");

    // Iterate over the data to create gradients
    columnsData.forEach(d => {
        if (d.fill && typeof d.fill === 'object') {
            const gradientId = `gradient-${d.id}`;

            // Create a linear gradient for vertical color distribution (top to bottom)
            const gradient = defs.append("linearGradient")
                .attr("id", gradientId)
                .attr("x1", "0%")
                .attr("x2", "0%")
                .attr("y1", "0%")
                .attr("y2", "100%"); // Vertical gradient

            let offset = 0;
            for (const [color, percentage] of Object.entries(d.fill)) {
                gradient.append("stop")
                    .attr("offset", `${offset}%`)
                    .attr("stop-color", color);
                offset += percentage; // Increase offset by the percentage value
                gradient.append("stop")
                    .attr("offset", `${offset}%`)
                    .attr("stop-color", color);
            }

            // Assign the gradient ID to the data item for later use
            d.gradientId = gradientId;
        }
    });

    // Join the data to rects
    const rects = svg.selectAll('rect')
        .data(columnsData, d => {
            if (d && d.id !== undefined) {
                return d.id;
            } else {
                console.warn("Data item without id:", d);  // Changed to warning
                console.log(d);  // Debug log
                return null;  // or some fallback value
            }
        });

    // Update existing rects
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.gradientId ? `url(#${d.gradientId})` : '#000') // Use gradient if available, otherwise fallback color
        .on('click', (event, d) => handleColumnClick(d.data))
        .on('contextmenu', function(event, d) {
            console.log("Context menu event on rectangle");
            handleRightClick(event, d);
        })
        .call(dragHandler);

    // Append new rects
    rects.enter()
        .append('rect')
        .attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.gradientId ? `url(#${d.gradientId})` : '#000') // Use gradient if available, otherwise fallback color
        .on('click', (event, d) => handleColumnClick(d.data))
        .on('contextmenu', handleRightClick)
        .call(dragHandler);

    // Remove old rects
    rects.exit().remove();

    console.log("Visualization updated");  // Debug log
}


function handleRightClick(event, d) {
    console.log("Right-click event triggered");
    event.preventDefault();
    
    // Remove any existing context menus
    d3.selectAll('.context-menu').remove();

    console.log("Creating context menu");
    const contextMenu = d3.select('body')
        .append('div')
        .attr('class', 'context-menu')
        .style('position', 'absolute')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`)
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px')
        .style('z-index', '1000');  // Ensure it's on top

    console.log("Context menu created:", contextMenu.node());

    const menuItems = ['Delete', 'Change Type', 'Action 3'];

    console.log("Adding menu items");
    contextMenu.selectAll('.menu-item')
        .data(menuItems)
        .enter()
        .append('div')
        .attr('class', 'menu-item')
        .text(item => item)
        .style('cursor', 'pointer')
        .style('padding', '5px')
        .style('hover', 'background-color: #f0f0f0')
        .on('click', function(event, item) {
            console.log(`Clicked on menu item: ${item}`);
            if (item === 'Delete') {
                columnsData = columnsData.filter(data => data.id !== d.id);
                console.log("Data after deletion:", columnsData);
                createColumnVisualization(columnsData);
                contextMenu.remove();
            } else if (item === 'Change Type') {
                showTypeOptions(event, d);
            } else {
                console.log(`Action for ${item} not implemented`);
            }
            contextMenu.remove();
        });

    console.log("Menu items added");

    // Prevent the context menu from closing immediately
    contextMenu.on('contextmenu', () => event.preventDefault());

    // Close the context menu when clicking outside
    d3.select('body').on('click.context-menu', () => {
        console.log("Body clicked, removing context menu");
        contextMenu.remove();
    });

    console.log("Context menu setup complete");
}

function showTypeOptions(event, d) {
    console.log("Showing type options");
    d3.selectAll('.context-menu').remove();

    const typeOptions = ['String', 'Integer', 'Float', 'Date', 'Boolean'];

    const typeMenu = d3.select('body')
        .append('div')
        .attr('class', 'context-menu')
        .style('position', 'absolute')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`)
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px')
        .style('z-index', '1000');

    typeMenu.selectAll('.type-option')
        .data(typeOptions)
        .enter()
        .append('div')
        .attr('class', 'type-option')
        .text(type => type)
        .style('cursor', 'pointer')
        .style('padding', '5px')
        .style('hover', 'background-color: #f0f0f0')
        .on('click', function(event, type) {
            console.log(`Changed type to ${type} for data:`, d);
            // Implement the logic to change the type here
            typeMenu.remove();
        });

    console.log("Type options menu created");
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
                console.log("Fetched data:", data);  // Debug log
                if (Array.isArray(data) && data.length > 0) {
                    createColumnVisualization(data);
                } else {
                    console.error("Invalid data format received");
                }
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});
});
