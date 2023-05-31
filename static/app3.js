d3.json(url).then(function(data) {
  // Extract unique months and airports from the data
  var carriers = [...new Set(data.map(item => item.carrier_name))];
  var airports = [...new Set(data.map(item => item.airport_name))];

  // console.log(carriers);
  console.log(airports);

  // Create the dropdown menu for month
  var carrierDropdown = d3.select("#carrierDropdown");
  carriers.forEach(function(carrier_name) {
    carrierDropdown.append("option").attr("value", carrier_name).text(carrier_name);
  });

  // Create the dropdown menu for airport
  var airportDropdown = d3.select("#airportDropdown");
  airports.forEach(function(airport_name) {
    airportDropdown.append("option").attr("value", airport_name).text(airport_name);
  });

  // Define the initial selected values
  var selectedCarrier = carrierDropdown.property("value");
  var selectedAirport = airportDropdown.property("value");

  console.log(selectedCarrier);
  console.log(selectedAirport);

  // Function to handle carrier dropdown change
  function changeCarrier() {
    selectedCarrier = carrierDropdown.property("value");
    console.log(selectedCarrier);
    createHeatmap();
  }

  // Function to handle airport dropdown change
  function changeAirport() {
    selectedAirport = airportDropdown.property("value");
    console.log(selectedAirport);
    createHeatmap();
  }

  // Attach change event listeners to dropdowns
  carrierDropdown.on("change", changeCarrier);
  airportDropdown.on("change", changeAirport);

  // Function to create the heatmap
  function createHeatmap() {
    
    d3.select("#heatmap").html("");

    // Filter the data based on selected values
    var filteredData = data.filter(function(d) {
      return (
        d.carrier_name === selectedCarrier &&
        d.airport_name === selectedAirport &&
        +d.arr_del15 > 0
      );
    });
    
    console.log(data)
    console.log(filteredData);

    var heatmap = d3
      .select("#heatmap")
      .selectAll(".heatmap-row")
      .data(filteredData)
      .enter()
      .append("div")
      .attr("class", "heatmap-row")
      .append("div")
      .attr("class", "heatmap-cell")
      .style("background-color", function(d) {
       
        var colorScale = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(filteredData, function(d) {
              return +d.arr_del15;
            }),
          ])
          .range(["steelblue", "red"]);
        return colorScale(+d.arr_del15);
      })
      .text(function(d) {
        return d.carrier_name; 
      })  
      .on("mouseover", function(d) {
        d3.select(this).style("opacity", 2);
        d3.select(this).append("div")
          .attr("class", "heatmap-tooltip")
          .text(function(d) {
            return "Month: " +d.month + ", Arrival Delays: " + d.arr_del15;
          });
      })  
      .on("mouseout", function(d) {
        d3.select(this).style("opacity", 0.4);
        d3.select(this).select(".heatmap-tooltip").remove();
      });
      
          
    var yLabel = d3
      .select("#heatmap")
      .append("div")
      .attr("class", "y-label")
      .text("Arrival Delay"); 
  }

  // Call the createHeatmap function initially
  createHeatmap();
    
  
});