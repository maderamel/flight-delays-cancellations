d3.json(url).then(function(data) {
    const myData = data;
    console.log(myData);
  
    function incomeBarChart() {
      const airlines = [...new Set(myData.map(item => item.UniqueCarrierName))];
  
      const netIncomeData = airlines.map(airline => {
        const airlineData = myData.filter(item => item.UniqueCarrierName === airline);
        const netIncomeSum = airlineData.reduce((sum, item) => sum + item.NetIncome, 0);
        return {
          airline: airline,
          netIncome: netIncomeSum
        };
      });
  
      const sortedData = netIncomeData.sort((a, b) => b.netIncome - a.netIncome);
  
      const xData = sortedData.map(item => item.airline);
      const yData = sortedData.map(item => item.netIncome);
  
      let trace = {
        x: xData,
        y: yData,
        type: 'bar'
      };
  
      let layout = {
        height: 400,
        width: 1200,
        title: 'Net Income by Airlines in 2022',
        xaxis: {
          title: 'Airline'
        },
        yaxis: {
          title: 'Net Income'
        }
      };
  
      let chartData = [trace];
  
      Plotly.newPlot('bar', chartData, layout);
    }
  
    incomeBarChart();
});



d3.json(url_1).then(function(data_1) {
  const myData_1 = data_1;
  console.log(myData_1);
  

  function delayBarChart() {
    // const airlines = [...new Set(myData_1.map(item => item.carrier_name))];
    const airlines = ['Allegiant Air',
    'JetBlue Airways',
    'Frontier Airlines Inc.',
    'Spirit Air Lines',
    'Southwest Airlines Co.',
    'Hawaiian Airlines Inc.',
    'American Airlines Inc.',
    'Alaska Airlines Inc.',
    'Mesa Airlines Inc.',
    'United Air Lines Inc.',
    'PSA Airlines Inc.',
    'Republic Airline',
    'Envoy Air',
    'Horizon Air',
    'SkyWest Airlines Inc.',
    'Endeavor Air Inc.',
    'Delta Air Lines Inc.']

    // const delayData = airlines.map(airline => {
    //   const airlineData = myData_1.filter(item => item.carrier_name === airline);
    //   const sumDelay = airlineData.reduce((sum, item) => sum + item.arr_del15, 0);
    //   const sumArr = airlineData.reduce((sum, item) => sum + item.arr_flights, 0);
    //   return {
    //     airline: airline,
    //     delayRate: sumDelay / sumArr
    //   };
    // });
    const delayRate = [32.83,
      31.27,
      30.86,
      23.87,
      23.35,
      23.19,
      21.84,
      19.70,
      18.99,
      18.84,
      18.69,
      18.62,
      16.89,
      16.33,
      16.30,
      15.73,
      15.68]

      // const sortedData = delayData.sort((a, b) => b.delayRate - a.delayRate);

      // const xData = sortedData.map(item => item.airline); 
      // const yData = sortedData.map(item => item.sumDelays);
      const xData = airlines;
      const yData = delayRate;

      let trace = {
          x: xData,
          y: yData,
          type: 'bar'
      };

      let layout = {
          height: 400,
          width: 1200,
          title: 'Delay Rate by Airline in 2022',
          xaxis: {
              title: 'Airline'
          },
          yaxis: {
              title: '(%)'
          }
      };

      let chartData = [trace];

      Plotly.newPlot('bar1', chartData, layout);
  }

  delayBarChart();
  });
      

function satBarChart() {
  const airlines = ['Southwest Airlines Co.',
      'JetBlue Airways',
      'Delta Air Lines Inc.',
      'Allegiant Air',
      'Alaska Airlines Inc.',
      'Segment Average',
      'SkyWest Airlines Inc.',
      'Air Canada',
      'United Air Lines Inc.',
      'Spirit Air Lines',
      'American Airlines Inc.',
      'Frontier Airlines Inc.',
      'WestJet']

  const satData = [849,
  828,
  813,
  803,
  794,
  792,
  777,
  774,
  772,
  770,
  755,
  751]

  const xData = airlines;
  const yData = satData;

      let trace = {
          x: xData,
          y: yData,
          type: 'bar'
      };

      let layout = {
          height: 400,
          width: 1200,
          title: 'Overall Customer Satisfaction by Airline in 2022',
          xaxis: {
              title: 'Airline'
          },
          yaxis: {
              title: '(Based on a 1000-point Scale)'
          }
      };

      let chartData = [trace];

      Plotly.newPlot('barSat', chartData, layout);
  }

  satBarChart();
