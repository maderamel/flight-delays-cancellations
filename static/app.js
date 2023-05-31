// Ariel's Code
d3.json(url).then(function(data) {
  const myData = data;
  console.log(myData);

  function init() {
    const airports = [...new Set(myData.map(d => d.airport))].sort();
    populateDropdown("selAirport", airports);

    const defaultAirport = airports[0];

    const defaultData = myData.filter(d => d.airport === defaultAirport);

    const dropdown = document.getElementById("selAirport");
    dropdown.value = defaultAirport;

    createTable(defaultData);
    Graph(defaultData);
    Metadata(defaultData);

  }

  function populateDropdown(elementId, options) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = "";

    options.forEach(function(option) {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.text = option;
      dropdown.appendChild(optionElement);
    });

    dropdown.addEventListener("change", function() {
      const selectedAirport = dropdown.value;
      const filteredData = myData.filter(d => d.airport === selectedAirport);
      createTable(filteredData);
      Graph(filteredData);
      Metadata(filteredData);
    });
  }

  function calculateRates(data) {
    const airlineData = d3.nest()
      .key(d => d.carrier_name)
      .rollup(function(values) {
        const totalFlights = d3.sum(values, d => parseFloat(d.arr_flights));
        const totalCancelled = d3.sum(values, d => parseFloat(d.arr_cancelled));
        const totalDelayed = d3.sum(values, d => parseFloat(d.arr_del15));

        const cancellationRate = (totalCancelled / totalFlights * 100).toFixed(2);
        const delayRate = (totalDelayed / totalFlights * 100).toFixed(2);

        return {
          cancellationRate,
          delayRate
        };
      })
      .entries(data);

    return airlineData.map(d => {
      return {
        airline: d.key,
        cancellationRate: parseFloat(d.value.cancellationRate),
        delayRate: parseFloat(d.value.delayRate)
      };
    });
  }

  function createTable(data) {
    const processedData = calculateRates(data);

    // Create the table element
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.textAlign = "center";

    // Create the table header row
    const headerRow = table.insertRow();
    headerRow.style.border = "1px solid black";
    const airlineHeader = headerRow.insertCell();
    airlineHeader.textContent = "Airline";
    airlineHeader.style.border = "1px solid black";
    const delayRateHeader = headerRow.insertCell();
    delayRateHeader.textContent = "Delay Rate (%)";
    delayRateHeader.style.border = "1px solid black";
    const cancellationRateHeader = headerRow.insertCell();
    cancellationRateHeader.textContent = "Cancellation Rate (%)";
    cancellationRateHeader.style.border = "1px solid black";


    // Create table rows
    processedData.forEach(function(d) {
      const row = table.insertRow();
      row.style.border = "1px solid black";
      const airlineCell = row.insertCell();
      airlineCell.textContent = d.airline;
      airlineCell.style.border = "1px solid black";
      const delayRateCell = row.insertCell();
      delayRateCell.textContent = d.delayRate;
      delayRateCell.style.border = "1px solid black";
      const cancellationRateCell = row.insertCell();
      cancellationRateCell.textContent = d.cancellationRate;
      cancellationRateCell.style.border = "1px solid black";
    });

    // Clear the previous table content
    const tableContainer = document.getElementById("table");
    tableContainer.innerHTML = "";

    // Append the table to the container
    tableContainer.appendChild(table);

    const rows = Array.from(table.rows).slice(1); 
    rows.sort(function(a, b) {
      const delayRateA = parseFloat(a.cells[1].textContent);
      const delayRateB = parseFloat(b.cells[1].textContent);
      return delayRateB - delayRateA; 
    });
      
    rows.forEach(function(row) {
      table.appendChild(row);
    });
  }

  /////////////////////////////////////////////

  
  // Test 
  function Graph(data) {

      // Extracting the month and arr_delayed values
      const DelPoints = data.map(data => ({
          month: data.month,
          arr_del15: data.arr_del15
      }));
  
      // Sorting the DelPoints array based on the month
      DelPoints.sort((a, b) => a.month - b.month);
  
      // Creating arrays for x-axis (months) and y-axis (arr_flights)
      const xDataDel = DelPoints.map(data => data.month);
      const yDataDel = DelPoints.map(data => data.arr_del15); 

      // Extracting the month and arr_cancelled values
      const CalPoints = data.map(data => ({
          month: data.month,
          arr_cancelled: data.arr_cancelled
      }));
  
      // Sorting the CalPoints array based on the month
      CalPoints.sort((a, b) => a.month - b.month);

      // Creating arrays for x-axis (months) and y-axis (arr_cancelled)
      const xDataCan = CalPoints.map(data => data.month);
      const yDataCan = CalPoints.map(data => data.arr_cancelled);
  
      // Creating a line graph 
      // Chart
        let delays = {
          x: xDataDel,
          y: yDataDel,
          name: "Delays",
          type: 'bar'
        };

        let cancellations = {
          x: xDataCan,
          y: yDataCan,
          name: "Cancellations",
          type: 'bar'
        };

        let layout = {
          height: 600,
          width: 800,
          title: "Cancelled and Delayed Flights by Airport for the Year 2022",
          xaxis: {
              title: 'Months'
            },
            yaxis: {
              title: 'Number of Cancelled / Delayed Flights'
            }
         };
        
        let ChartData = [delays, cancellations];
        
        Plotly.newPlot("bar", ChartData, layout);
      
  }  


  function Metadata(data) {

    // Extracting the carrier_ct values
    let InfoData = data.map(data => ({
      airport_name: data.airport_name,
      arr_del15: data.arr_del15,
      nas_ct: data.nas_ct,
      carrier_ct: data.carrier_ct,
      weather_ct: data.weather_ct,
      security_ct: data.security_ct,
      late_aircraft: data.late_aircraft
    }));

    //console.log(InfoData[0])

    let AirportName = Object.values(InfoData[0])[0];
    let carrierDel = InfoData.map(data => data.carrier_ct);
    let carrierDelSum = carrierDel.reduce(function(a, b){
      return a + b;
      });
    let nasDel = InfoData.map(data => data.nas_ct);
    let nasDelSum = nasDel.reduce(function(a, b){
      return a + b;
      });
    let weatherDel = InfoData.map(data => data.weather_ct);
    let weatherDelSum = weatherDel.reduce(function(a, b){
      return a + b;
      });
    let securityDel = InfoData.map(data => data.security_ct);
    let securityDelSum = securityDel.reduce(function(a, b){
      return a + b;
      });

    let lateAircraftDel = InfoData.map(data => data.late_aircraft);
    let lateAircraftDelSum = lateAircraftDel.reduce(function(a, b){
      return a + b;
      });

    let totalDel = InfoData.map(data => data.arr_del15);
    let totalDelSum = totalDel.reduce(function(a, b){
      return a + b;
      });

    let displayData = {
      Airport_Name: AirportName,
      Total_Delayed_Flights: totalDelSum,
      Air_Carrier_Delays: carrierDelSum,
      NAS_Delays: nasDelSum,
      Weather_Delays: weatherDelSum,
      Security_Delays: securityDelSum,
      Late_Arrival_Delays: lateAircraftDelSum
    }

    // Select metadata location in html file
    d3.select("#sample-metadata").html("");
    // Append each key-value pair 
    Object.entries(displayData).forEach(([key, value]) => {
      console.log(key, value);
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
   }

   init();
}
);

