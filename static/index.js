const svg = d3.select('.container .canva svg');
const svg2 = d3.select('.container .new-container div svg');
const svg3 = d3.select('.container .bottom-container canva svg');

let typesData = [];
let inspectedTypesData = [];

let columnsData = [];
let inspectedColumnsData = [];



// console.log("D3 version:", d3.version);

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
    typesData = typesData.concat(data); // Combine new data with existing data

    // Join the data to rects, using a unique key (e.g., 'id')
    const rects = svg.selectAll('rect')
        .data(typesData, d => d.id);  // Ensure there's a unique key like 'id'

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
    // Update inspectedTypesData with new data
    inspectedTypesData = data;

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
        .data(inspectedTypesData);

    // Compute width based on text length
    inspectedTypesData.forEach(d => {
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
    const totalHeight = inspectedTypesData.length * (rectHeight + padding);
    svg2.attr('height', totalHeight);

    // Update text elements
    const texts = svg2.selectAll('text')
        .data(inspectedTypesData);

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
    // console.log("Received data:", data);  // Debug log

    // Filter out any undefined or null items
    columnsData = data.filter(item => item != null);

    // console.log("Filtered columnsData:", columnsData);  // Debug log

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
        .attr('fill', d => d.fill)
        .on('click', (event, d) => handleColumnClick(d.data))
        .on('contextmenu', function(event, d) {
            // console.log("Context menu event on rectangle");
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
        .attr('fill', d => d.fill)
        .on('click', (event, d) => handleColumnClick(d.data))
        .on('contextmenu', handleRightClick)
        .call(dragHandler);

    // Remove old rects
    rects.exit().remove();

    console.log("Visualization updated");  // Debug log
}

function handleRightClick(event, d) {
    event.preventDefault();
    
    // Remove any existing context menus
    d3.selectAll('.context-menu').remove();

    const contextMenu = d3.select('body')
        .append('div')
        .attr('class', 'context-menu')
        .style('position', 'absolute')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`)
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px')
        .style('z-index', '1000');

    const menuItems = ['Delete', 'Change Type', 'Sort'];

    contextMenu.selectAll('.menu-item')
        .data(menuItems)
        .enter()
        .append('div')
        .attr('class', 'menu-item')
        .text(item => item)
        .style('cursor', 'pointer')
        .style('padding', '5px')
        .on('click', function(event, item) {
            event.stopPropagation(); // Prevent event bubbling
            if (item === 'Delete') {
                columnsData = columnsData.filter(data => data.id !== d.id);
                createColumnVisualization(columnsData);
                contextMenu.remove();
            } else if (item === 'Change Type') {
                showTypeOptions(event, d);
                contextMenu.remove(); // Remove after showing type options
            } else if (item === 'Sort') {
                showSortOptions(event, d, columnsData);
                contextMenu.remove(); // Remove after showing sort options
            }
        });

    contextMenu.on('contextmenu', () => event.preventDefault());

    d3.select('body').on('click.context-menu', () => {
        contextMenu.remove();
    });
}


function showSortOptions(event, d, allColumns) {
    // Remove any existing context menus
    d3.selectAll('.context-menu').remove();

    const sortOptions = ['Sort by Type', 'Sort by Value'];

    const sortMenu = d3.select('body')
        .append('div')
        .attr('class', 'context-menu')
        .style('position', 'absolute')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`)
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px')
        .style('z-index', '1000'); // Ensure it appears on top

    sortMenu.selectAll('.sort-option')
        .data(sortOptions)
        .enter()
        .append('div')
        .attr('class', 'sort-option')
        .text(option => option)
        .style('cursor', 'pointer')
        .style('padding', '5px')
        .on('click', function(event, option) {
            event.stopPropagation(); // Prevent event bubbling
            
            if (option === 'Sort by Type') {
                sortByType(d, allColumns);
            } else if (option === 'Sort by Value') {
                sortByValue(d, allColumns);
            }

            sortMenu.remove(); // Remove the sort menu after selecting an option
        });

    // Close the sort menu when clicking outside
    d3.select('body').on('click.sort-menu', () => {
        sortMenu.remove();
    });

    // Prevent context menu from closing immediately
    sortMenu.on('contextmenu', () => event.preventDefault());
}


function sortByValue(selectedColumn, allColumns) {
    // Exclude the first element and sort the rest by 'value' and store sorted indices
    const sortedIndices = selectedColumn.data.slice(1)
        .map((d, i) => i + 1)  // Skip the first element
        .sort((a, b) => {
            // Get the string values
            const valueA = selectedColumn.data[a].value;
            const valueB = selectedColumn.data[b].value;

            // Use localeCompare for string comparison
            return valueA.localeCompare(valueB);
        });

    // Reorder all columns based on sorted indices
    reorderColumns(allColumns, sortedIndices);

    // Log sorted data to the console
    console.log('Sorted by Value:', allColumns);
}

function sortByType(selectedColumn, allColumns) {
    // Exclude the first element and sort the rest by 'type' and store sorted indices
    const sortedIndices = selectedColumn.data.slice(1)
        .map((d, i) => i + 1)  // Skip the first element
        .sort((a, b) => selectedColumn.data[a].type.localeCompare(selectedColumn.data[b].type));

    // Reorder all columns based on sorted indices
    reorderColumns(allColumns, sortedIndices);

    // Log sorted data to the console
    console.log('Sorted by Type:', allColumns);
}

function reorderColumns(allColumns, sortedIndices) {
    allColumns.forEach(column => {
        column.data = [column.data[0]].concat(sortedIndices.map(i => column.data[i]));
    });
}


function showTypeOptions(event, d) {
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
        .on('click', function(event, type) {
            event.stopPropagation(); // Prevent event bubbling
            console.log(`Changed type to ${type} for data:`, d);
            typeMenu.remove();
        });

    d3.select('body').on('click.type-menu', () => {
        typeMenu.remove();
    });

    typeMenu.on('contextmenu', () => event.preventDefault());
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


// Function to update and render visualization
function renderUpdatedVisualization(data) {
    console.log("Updating visualization with new data:", data);  // Debug log

    
}



// Ensure the buttons are selected and the event listeners are attached correctly
document.addEventListener('DOMContentLoaded', () => {
    const dataButton = d3.select('#fetch-data');
    const columnsButton = d3.select('#fetch-columns');
    const updateButton = d3.select('#update-visualization');

    updateButton.on('click', () => {
        svg3.selectAll('*').remove();
        renderUpdatedVisualization(columnsData)
    });

    
    dataButton.on('click', () => {
        svg2.selectAll('*').remove();
        const fileName = 'top_1000_films.csv';
        fetch(`/get_data?file=${fileName}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    // Create a deep copy of the data
                    const dataCopy = JSON.parse(JSON.stringify(data));
                    createVisualization(dataCopy); // Pass the copy to the visualization function
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
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
                    // console.log("Fetched data:", data);  // Debug log
                    if (Array.isArray(data) && data.length > 0) {
                        // Create a deep copy of the data
                        const dataCopy = JSON.parse(JSON.stringify(data));
                        createColumnVisualization(dataCopy); // Pass the copy to the column visualization function
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
