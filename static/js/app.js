// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(result).forEach(([k, v]) => {
      panel.append('h6').text(`${k}: ${v}`);
    }
    );
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let result = resultArray[0];
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;


    // Build a Bubble Chart
    // Set up the trace for the Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
        colorbar: {
          title: 'OTU'
        }
      }
    };

    // Build the Bubble Chart
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      showlegend: false,
      height: 600,
      width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Slice the top 10 sample_values, otu_ids, and labels for plotting
    let yticks = otu_ids.slice(0, 10).map(otuID => `${otuID}`).reverse();
    let barSampleValues = sample_values.slice(0, 10).reverse();
    let barOtuLabels = otu_labels.slice(0, 10).reverse();
    
    // console.log(otu_labels);


    // Set up the trace for the Bar Chart
    let barTrace = {
      x: barSampleValues,
      y: yticks,
      text: barOtuLabels,
      type: 'bar',
      orientation: 'h'
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [barTrace];

    let barLayout = {
      height: 400,
      width: 800,
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Sample Values'},
      yaxis: {title: 'OTU'}
    };
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  // d3.json() returns Promise. 
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data['names'];


    // Use d3 to select the dropdown with id of `#selDataset`
    let s = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      s.append('option').text(sample).property('value', sample);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
