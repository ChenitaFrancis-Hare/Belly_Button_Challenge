// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
//console.log(data);
  //Set the dropdown menu element of the HTML code 
  let dropmenu = d3.select("#selDataset"); 
  //Call name array to add IDs to Test Subject ID No  
  let names = data.names;

  names.forEach((name) => {
    dropmenu.append("option").text(name).property("value", name);
  
  });
  

  let name = names[0];
  // Call the functions to create the demographic panel, bar chart, and bubble chart
  demo(name);
  bar(name);
  bubble(name);
  gauge(name);
});

// Create the demographics panel
function demo(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {
      console.log(`Data: ${data}`);

      let metadata = data.metadata;
            
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
    
      // Assign the first object to obj variable
      let obj = filteredData[0]
      
      // Clear the child elements in div with id sample-metadata
      d3.select("#sample-metadata").html("");

      // Object.entries() is a built-in method in JavaScript 
      // This returns an array of a given object's own enumerable property [key, value]
      let entries = Object.entries(obj);
      
      // Iterate through the entries array
      // Add a h5 child element for each key-value pair to the div with id sample-metadata
      entries.forEach(([key,value]) => {
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });

      // Log the entries Array
      console.log(entries);
  });
}


// Create the bar chart
function bar(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {
      console.log(`Data: ${data}`);

      let samples = data.samples;

      // Filter data where id = selected value 
      let filteredData = samples.filter((sample) => sample.id === selectedValue);

      // Assign the first object to obj variable
      let obj = filteredData[0];
      
      // Trace for the data for the horizontal bar chart
      let trace = [{
          // Slice the top 10 otus
          x: obj.sample_values.slice(0,10).reverse(),
          y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
          text: obj.otu_labels.slice(0,10).reverse(),
          type: "bar",
          marker: {
              color: "rgb(237,166,207)"
          },
          orientation: "h"
      }];
      
      // Plot  data in a bar chart
      Plotly.newPlot("bar", trace);
  });
}

// Create the bubble chart
function bubble(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {

      let samples = data.samples;
  
      // Filter data where id = selected value 
      let filteredData = samples.filter((sample) => sample.id === selectedValue);
  
      // Assign the first object to obj variable
      let obj = filteredData[0];
      
      // Trace data for bubble chart
      let trace = [{
          x: obj.otu_ids,
          y: obj.sample_values,
          text: obj.otu_labels,
          mode: "markers",
          marker: {
              size: obj.sample_values,
              color: obj.otu_ids,
              colorscale: "Earth"
          }
      }];
  
      // Set x-axis legend to the layout
      let layout = {
          xaxis: {title: "OTU ID"}
      };
  
      // Plot data in a bubble chart
      Plotly.newPlot("bubble", trace, layout);
  });
}

// Create the gauge chart 
function gauge(selectedValue) {
  // Fetch the JSON data and console log it 
  d3.json(url).then((data) => {
      // An array of metadata objects
      let metadata = data.metadata;
      
      
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
    
      // Assign the first object to obj variable
      let obj = filteredData[0]

      // Trace data for the gauge chart
      let trace = [{
          domain: { x: [0, 1], y: [0, 1] },
          value: obj.wfreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
          type: "indicator", 
          mode: "gauge+number",
          gauge: {
              axis: {range: [null, 10]}, 
              bar: {color: "rgb(68,166,198)"},
              steps: [
                  { range: [0, 1], color: "rgb(250,165,162)" },
                  { range: [1, 2], color: "rgb(250,216,162)" },
                  { range: [2, 3], color: "rgb(241,250,162)" },
                  { range: [3, 4], color: "rgb(202,250,162)" },
                  { range: [4, 5], color: "rgb(162,250,170)" },
                  { range: [5, 6], color: "rgb(162,250,218)" },
                  { range: [6, 7], color: "rgb(162,237,250)" },
                  { range: [7, 8], color: "rgb(162,192,250)" },
                  { range: [8, 9], color: "rgb(174,162,250)" },
                  { range: [9, 10], color: "rgb(213,162,250)" }
              ]
          }
      }];

       // Plot data in a gauge chart
       Plotly.newPlot("gauge", trace);
  });
}

// Switch to new plots when option changed
function optionChanged(selectedValue) {
  demo(selectedValue);
  bar(selectedValue);
  bubble(selectedValue);
  gauge(selectedValue)
}

init();


