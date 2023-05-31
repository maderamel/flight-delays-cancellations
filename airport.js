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

  
  // Graph
  function Graph(data) {

      // Delays
      // Initialize object to store monthly sums
      const monthlySums = {};

      // Iterate over data array
      data.forEach(dataPoint => {
      const month = dataPoint.month;
      const yValue = dataPoint.arr_del15;

      // Check if month exists in monthly sums
      if (monthlySums.hasOwnProperty(month)) {
          // Add yValue to existing sum for that month
          monthlySums[month] += yValue;
      } else {
          // Create new entry for the month with yValue as initial sum
          monthlySums[month] = yValue;
      }
      });

      // Extract x-axis (months) and y-axis (sum of y-values) data
      const xDataDelay = Object.keys(monthlySums).map(month => parseInt(month));
      const yDataDelay = Object.values(monthlySums);

      // Cancellations
      // Initialize object to store monthly sums
      const monthlySumsCancel = {};

      // Iterate over data array
      data.forEach(dataPoint => {
      const monthCancel = dataPoint.month;
      const yValueCancel = dataPoint.arr_cancelled;
      
      // Check if month exists in monthly sums
      if (monthlySumsCancel.hasOwnProperty(monthCancel)) {
          // Add yValue to existing sum for that month
          monthlySumsCancel[monthCancel] += yValueCancel;
      } else {
          // Create new entry for the month with yValue as initial sum
          monthlySumsCancel[monthCancel] = yValueCancel;
      }
      });
      
      // Extract x-axis (months) and y-axis (sum of y-values) data
      const xDataCancel = Object.keys(monthlySumsCancel).map(month => parseInt(month));
      const yDataCancel = Object.values(monthlySumsCancel);


      // Creating a line graph 
      // Chart
        let delays = {
          x: xDataDelay,
          y: yDataDelay,
          name: "Delays",
          type: 'line',
        };

        let cancellations = {
          x: xDataCancel,
          y: yDataCancel,
          name: "Cancellations",
          type: 'line',
        };

        let layout = {
          height: 600,
          width: 800,
          title: "Cancelled and Delayed Flights by Airport for the Year 2022",
          barmode: 'group',
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

    let AirportName = Object.values(InfoData[0])[0];

    let carrierDel = InfoData.map(data => data.carrier_ct);
    let carrierDelSum = carrierDel.reduce(function(a, b){
        return a + b;
      });
    carrierDelSum = carrierDelSum.toFixed(2);

    let nasDel = InfoData.map(data => data.nas_ct);
    let nasDelSum = nasDel.reduce(function(a, b){
        return a + b;
      });
    nasDelSum = nasDelSum.toFixed(2);

    let weatherDel = InfoData.map(data => data.weather_ct);
    let weatherDelSum = weatherDel.reduce(function(a, b){
        return a + b;
      });
    weatherDelSum = weatherDelSum.toFixed(2);

    let securityDel = InfoData.map(data => data.security_ct);
    let securityDelSum = securityDel.reduce(function(a, b){
        return a + b;
      });
    securityDelSum = securityDelSum.toFixed(2);

      
    let lateAircraftDel = InfoData.map(data => data.late_aircraft);
    let lateAircraftDelSum = lateAircraftDel.reduce(function(a, b){
        return a + b;
      });
    lateAircraftDelSum = lateAircraftDelSum.toFixed(2);
      
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
});