const svg = d3.select('svg');
let allData = [];

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
        .on('click', function( d) {
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
        });

    // Append the enter selection to the DOM
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', function( d) {
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
            });

    // Remove any rects that are no longer in the data
    rects.exit().remove();
}

// Function to append new data to the existing visualization
function appendNewData(newData) {
    allData = allData.concat(newData); // Combine new data with existing data

    // Join the new data to rects
    const rects = svg.selectAll('rect')
        .data(allData);

    // Update the attributes of existing rects
    rects.attr('y', d => d.y)
        .attr('x', d => d.x)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('fill', d => d.fill);

    // Append new rects
    rects.enter()
        .append('rect')
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('height', d => d.height)
            .attr('width', d => d.width)
            .attr('fill', d => d.fill)
            .on('click', function( d) {
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
            });

    // Remove rects that are no longer in the data
    rects.exit().remove();
}

// Create buttons and fetch data as before
const button = document.createElement('button');
button.textContent = 'Fetch Data';
button.style.position = 'fixed';
button.style.top = '10px';
button.style.right = '10px';
button.addEventListener('click', () => {
    const fileName = 'archive/2015-16/champs.csv';
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
document.body.appendChild(button);

// const svg = d3.select('svg');
// let allData = []; // Store all data here

// // Function to create visualization
// function createVisualization(data) {
//     allData = allData.concat(data); // Combine new data with existing data

//     // Join the data to rects
//     const rects = svg.selectAll('rect')
//         .data(allData);

//     // Add attrs to rects already in the DOM
//     rects.attr('y', d => d.y)
//         .attr('x', d => d.x)
//         .attr('height', d => d.height)
//         .attr('width', d => d.width)
//         .attr('fill', d => d.fill)
//         .on('click', function(d) {
//             console.log(d.data);

//             fetch('/post_bar_data', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(d.data)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Response from server:', data);
//                 // Add new data to the visualization
//                 appendNewData(data.result);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//         });
//         // .on('click', function(d) {
//         //     console.log(d.data);
//         // })
//         // .on('contextmenu', function(event, d) {
//         //     event.preventDefault();
//         // });

//     // Append the enter selection to the DOM
//     rects.enter()
//         .append('rect')
//             .attr('y', d => d.y)
//             .attr('x', d => d.x)
//             .attr('height', d => d.height)
//             .attr('width', d => d.width)
//             .attr('fill', d => d.fill)
//             .on('click', function(d) {
//                 console.log(d.data);
    
//                 fetch('/post_bar_data', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(d.data)
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Response from server:', data);
//                     // Add new data to the visualization
//                     appendNewData(data.result);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             });
//             // .on('click', function(d) {
//             //     console.log(d.data);
//             // })
//             // .on('contextmenu', function(event, d) {
//             //     event.preventDefault();
//             // });

//     // Remove any rects that are no longer in the data
//     rects.exit().remove();
// }



// // Create buttons and fetch data as before
// const button = document.createElement('button');
// button.textContent = 'Fetch Data';
// button.style.position = 'fixed';
// button.style.top = '10px';
// button.style.right = '10px';
// button.addEventListener('click', () => {
//     const fileName = 'archive/2015-16/champs.csv';
//     fetch(`/get_data?file=${fileName}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) {
//                 console.error(data.error);
//             } else {
//                 createVisualization(data);
//             }
//         });
// });
// document.body.appendChild(button);

// // const adjacentButton = document.createElement('button');
// // adjacentButton.textContent = 'Get Adjacent Data';
// // adjacentButton.style.position = 'fixed';
// // adjacentButton.style.top = '50px';
// // adjacentButton.style.right = '10px';
// // adjacentButton.addEventListener('click', () => {
// //     const fileName = 'archive/2015-16/champs.csv';
// //     fetch(`/get_adjacent_data?file=${fileName}`)
// //         .then(response => response.json())
// //         .then(data => {
// //             if (data.error) {
// //                 console.error(data.error);
// //             } else {
// //                 createVisualization(data);
// //             }
// //         });
// // });
// // document.body.appendChild(adjacentButton);
