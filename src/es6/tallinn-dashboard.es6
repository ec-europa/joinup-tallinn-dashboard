const init = (
  dataSet,
    highchartContainerId,
    dropdownIds,
    csvButtonClass,
    dropdownContainersClass,
    dropdownClass,
    titleClass,
    descriptionClass,
    bodyClass,
    allMembersString,
    seriesColors,
    legendClass,
    legendData,
    statuses
) => {
  let state = dropdownIds.reduce(
    (a, b) => Object.assign({}, a, { [b]: '' }),
    {}
);

  const chart = Highcharts.chart(highchartContainerId, {
      chart: {
        polar: true,
        type: 'area',
      },

      title: {
        text: '',
      },

      pane: {
        size: '90%',
        startAngle: 0
      },

      xAxis: {
        allowDecimals: false,
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
      },

      yAxis: {
        allowDecimals: false,
        plotLines: legendData.map((l, i) => ({
          color: l.color,
          width: 2,
          value: i
        })),
    labels: {
    enabled: false
  },
  gridLineDashStyle: 'dot',
    gridLineInterpolation: 'polygon',
    lineWidth: 0,
    max: 4,
    min: 0,
},

  navigation: {
    buttonOptions: {
      enabled: false
    }
  },

  tooltip: {
    valueDecimals: 0,
      followPointer: true,
      shared: true,
      formatter: function () {
      var s = dataSet[this.points[0].point.index].description;
      this.points.forEach(function (current) {
        s +='<br/><b>' + current.series.name + ':</b> ' +  statuses[Math.round(current.y)];
      });
      return s;
    },
    shared:true
  },
  plotOptions: {
    series: {
      fillOpacity: 0.4
    },
  },

  legend: {
    enabled: false
  },
});

  const setState = newState => {
    state = Object.assign({}, state, newState);
    return state;
  };

  const setLabels = index => {
    document.querySelector(titleClass).innerHTML = '';
    document.querySelector(bodyClass).innerHTML = '';
    document.querySelector(descriptionClass).innerHTML = '';

    if (index !== null) {
      if (index === '') {
        chart.setTitle({ text: '' });
        chart.xAxis[0].setCategories(dataSet.map(el => el.principle));
      } else {
        chart.setTitle({ text: dataSet[index].principle });
        chart.xAxis[0].setCategories(dataSet[index].actions.map(el => el.title));

        dataSet[index].actions.map(
          el => Object.keys(el.countries).forEach(
          key => {
          if(key == d1.options[d1.selectedIndex].value){
            let relatedWebsite = el.countries[key].related_website === null ? '[not provided]' : ('<a href="' + el.countries[key].related_website + '">' + el.countries[key].related_website + '</a>');
            document.querySelector(bodyClass).insertAdjacentHTML(
             'beforeend',
              `<h5>${el.countries[key].country_name}</h5>
                    <h6>${dataSet[index].description}</h6>
                    <p>${el.countries[key].report}</p>
                    <p>Status: ${el.countries[key].status}</p>  
                    <p>Related website: ${relatedWebsite}</p>`)
        }}
      ))
      }
    }
  }

  const getIndex = str => statuses.indexOf(str);

  const computeAllAverage = data =>
  Object.keys(data).reduce((a, b) => a + getIndex(data[b].status), 0) /
  Object.keys(data).length;

  const setSeries = () => {
    let data1 = [];
    let data2 = [];

    if (state[dropdownIds[2]] === '') {
      // All Principles - calculate the average
      dataSet.forEach(e => {
        let total1 = 0;
      let total2 = 0;

      Object.keys(e.actions).forEach(z => {
        total1 +=
          state[dropdownIds[0]] !== allMembersString
            ? getIndex(e.actions[z].countries[state[dropdownIds[0]]].status)
            : computeAllAverage(e.actions[z].countries);
      // test for all member states
      if (state[dropdownIds[1]]) {
        total2 +=
          state[dropdownIds[1]] !== allMembersString
            ? getIndex(e.actions[z].countries[state[dropdownIds[1]]].status)
            : computeAllAverage(e.actions[z].countries);
      }
    });

      data1.push(total1 / Object.keys(e.actions).length);
      data2.push(total2 / Object.keys(e.actions).length);
    });
    } else {
      // on a selected principle
      Object.keys(dataSet[state[dropdownIds[2]]].actions).forEach(z => {
        data1.push(
        state[dropdownIds[0]] !== allMembersString
          ? getIndex(dataSet[state[dropdownIds[2]]].actions[z].countries[state[dropdownIds[0]]].status)
          : computeAllAverage(dataSet[state[dropdownIds[2]]].actions[z].countries)
      );
      if (state[dropdownIds[1]]) {
        data2.push(
          state[dropdownIds[1]] !== allMembersString
            ? getIndex(dataSet[state[dropdownIds[2]]].actions[z].countries[state[dropdownIds[1]]].status)
            : computeAllAverage(dataSet[state[dropdownIds[2]]].actions[z].countries)
        );
      }
    });
    }

    // Remove all previous series
    for (let i = chart.series.length - 1; i > -1; i--) {
      chart.series[i].remove();
    }

    const d1 = document.getElementById(dropdownIds[0]);
    const d2 = document.getElementById(dropdownIds[1]);

    // Add new ones
    chart.addSeries({
      name: d1.options[d1.selectedIndex].text,
      data: data1,
      color: seriesColors[0],
    });
    chart.addSeries({
      name: d2.options[d2.selectedIndex].text,
      data: data2,
      color: seriesColors[1],
    });
  };

  // add colors for country labels
  document.querySelectorAll(`${dropdownContainersClass} span`).forEach((el, i) => el.style['background-color'] = seriesColors[i])

  // populate Principles inside 3rd dropdown
  dataSet.forEach((k, i) => {
    let opt = document.createElement('option');
  opt.value = i;
  opt.innerHTML = k.principle;
  document.querySelector(`#${dropdownIds[2]}`).appendChild(opt);
});

  // populate the legend
  legendData.reverse().map(l => {
    let li = document.createElement('li');
  let s = document.createElement('span');

  li.innerHTML = l.label;
  s.style.cssText = `background-color: ${l.color}`;
  li.insertBefore(s, null);
  document.querySelector(`${legendClass} ul`).appendChild(li);
})

  // Init categories based on the 3rd dropdown
  const d1 = document.getElementById(dropdownIds[0]);
  setLabels(document.querySelector(`#${dropdownIds[2]}`).value);

  // add event listeners
  document.querySelectorAll(dropdownClass).forEach(el => {
    // Read the defaults if any
    setState({
               [el.id]: el.value,
});

  // Add an event listeners to selects
  el.addEventListener('change', evt => {
    setState({
               [evt.currentTarget.id]: evt.currentTarget.value,
});

  // Principle dropdown, change categories and tiles
  if (evt.currentTarget.id === dropdownIds[2]) {
    setLabels(evt.currentTarget.value);
  }

  if (evt.currentTarget.id === dropdownIds[0]) {
    const d1 = document.getElementById(dropdownIds[0]);
    setLabels(document.querySelector(`#${dropdownIds[2]}`).value);
  }

  // redraw
  setSeries();
});
});

  // add CSV download event listener
  document.querySelector(csvButtonClass).addEventListener('click', e => {
    chart.downloadCSV();
  })

  return {
    dataSet,
    chart,
    state,
    setState,
    setLabels,
    setSeries,
  };
};

((drupalSettings) => {
  const req = new XMLHttpRequest();
req.overrideMimeType('application/json');
req.open('GET', drupalSettings.tallinn.dataEndpoint, true);
req.onload = () => {
  const TALLINNHI = init(
    JSON.parse(req.responseText),
    'tallinn-chart__container',
    ['select1', 'select2', 'select3'],
    '.tallinn-chart__button--csv',
    '.tallinn-chart__selector-container',
    '.tallinn-chart__selector',
    '.tallinn-chart__country',
    '.tallinn-chart__description',
    '.tallinn-chart__body',
    'All members',
    ['#0399FB', '#F13601'],
    '.tallinn-chart__legend',
    [
      { color: '', label: '' },
      { color: '#aaa', label: 'No data' },
      { color: '#faa', label: 'No progress' },
      { color: '#fc0', label: 'In progress' },
      { color: '#BC7', label: 'Completed' }
    ],
    [
      '',
      'No data', 'No progress',
      'In progress',
      'Completed'
    ]
  );

  // Draw
  TALLINNHI.setSeries();
};
req.send();
})(drupalSettings);
