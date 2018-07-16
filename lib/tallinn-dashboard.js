'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var init = function init(dataSet, highchartContainerId, dropdownIds, csvButtonClass, dropdownContainersClass, dropdownClass, titleClass, descriptionClass, bodyClass, allMembersString, seriesColors, legendClass, legendData, statuses) {
  var state = dropdownIds.reduce(function (a, b) {
    return Object.assign({}, a, _defineProperty({}, b, ''));
  }, {});

  var chart = Highcharts.chart(highchartContainerId, {
    chart: {
      polar: true,
      type: 'area'
    },

    title: {
      text: ''
    },

    pane: {
      size: '90%',
      startAngle: 0
    },

    xAxis: {
      allowDecimals: false,
      categories: [],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },

    yAxis: {
      allowDecimals: false,
      plotLines: legendData.map(function (l, i) {
        return {
          color: l.color,
          width: 2,
          value: i
        };
      }),
      labels: {
        enabled: false
      },
      gridLineDashStyle: 'dot',
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      max: 4,
      min: 0
    },

    navigation: {
      buttonOptions: {
        enabled: false
      }
    },

    tooltip: _defineProperty({
      valueDecimals: 0,
      followPointer: true,
      shared: true,
      formatter: function formatter() {
        var s = dataSet[this.points[0].point.index].description;
        this.points.forEach(function (current) {
          s += '<br/><b>' + current.series.name + ':</b> ' + statuses[Math.round(current.y)];
        });
        return s;
      }
    }, 'shared', true),
    plotOptions: {
      series: {
        fillOpacity: 0.4
      }
    },

    legend: {
      enabled: false
    }
  });

  var setState = function setState(newState) {
    state = Object.assign({}, state, newState);
    return state;
  };

  var setLabels = function setLabels(index) {
    document.querySelector(titleClass).innerHTML = '';
    document.querySelector(bodyClass).innerHTML = '';
    document.querySelector(descriptionClass).innerHTML = '';

    if (index !== null) {
      if (index === '') {
        chart.setTitle({ text: '' });
        chart.xAxis[0].setCategories(dataSet.map(function (el) {
          return el.principle;
        }));
      } else {
        chart.setTitle({ text: dataSet[index].principle });
        chart.xAxis[0].setCategories(dataSet[index].actions.map(function (el) {
          return el.title;
        }));

        dataSet[index].actions.map(function (el) {
          return Object.keys(el.countries).forEach(function (key) {
            if (key == d1.options[d1.selectedIndex].value) {
              document.querySelector(bodyClass).insertAdjacentHTML('beforeend', '<h5>' + el.countries[key].country_name + '</h5>\n                  <h6>' + dataSet[index].description + '</h6>\n                  <p>' + el.countries[key].report + '</p>\n                  <p>Status: ' + el.countries[key].status + '</p>\n                  <p>Related website: \n                   <a href="' + el.countries[key].related_website + '">' + el.countries[key].related_website + '</a>\n                  </p>');
            }
          });
        });
      }
    }
  };

  var getIndex = function getIndex(str) {
    return statuses.indexOf(str);
  };

  var computeAllAverage = function computeAllAverage(data) {
    return Object.keys(data).reduce(function (a, b) {
      return a + getIndex(data[b].status);
    }, 0) / Object.keys(data).length;
  };

  var setSeries = function setSeries() {
    var data1 = [];
    var data2 = [];

    if (state[dropdownIds[2]] === '') {
      // All Principles - calculate the average
      dataSet.forEach(function (e) {
        var total1 = 0;
        var total2 = 0;

        Object.keys(e.actions).forEach(function (z) {
          total1 += state[dropdownIds[0]] !== allMembersString ? getIndex(e.actions[z].countries[state[dropdownIds[0]]].status) : computeAllAverage(e.actions[z].countries);
          // test for all member states
          if (state[dropdownIds[1]]) {
            total2 += state[dropdownIds[1]] !== allMembersString ? getIndex(e.actions[z].countries[state[dropdownIds[1]]].status) : computeAllAverage(e.actions[z].countries);
          }
        });

        data1.push(total1 / Object.keys(e.actions).length);
        data2.push(total2 / Object.keys(e.actions).length);
      });
    } else {
      // on a selected principle
      Object.keys(dataSet[state[dropdownIds[2]]].actions).forEach(function (z) {
        data1.push(state[dropdownIds[0]] !== allMembersString ? getIndex(dataSet[state[dropdownIds[2]]].actions[z].countries[state[dropdownIds[0]]].status) : computeAllAverage(dataSet[state[dropdownIds[2]]].actions[z].countries));
        if (state[dropdownIds[1]]) {
          data2.push(state[dropdownIds[1]] !== allMembersString ? getIndex(dataSet[state[dropdownIds[2]]].actions[z].countries[state[dropdownIds[1]]].status) : computeAllAverage(dataSet[state[dropdownIds[2]]].actions[z].countries));
        }
      });
    }

    // Remove all previous series
    for (var i = chart.series.length - 1; i > -1; i--) {
      chart.series[i].remove();
    }

    var d1 = document.getElementById(dropdownIds[0]);
    var d2 = document.getElementById(dropdownIds[1]);

    // Add new ones
    chart.addSeries({
      name: d1.options[d1.selectedIndex].text,
      data: data1,
      color: seriesColors[0]
    });
    chart.addSeries({
      name: d2.options[d2.selectedIndex].text,
      data: data2,
      color: seriesColors[1]
    });
  };

  // add colors for country labels
  document.querySelectorAll(dropdownContainersClass + ' span').forEach(function (el, i) {
    return el.style['background-color'] = seriesColors[i];
  });

  // populate Principles inside 3rd dropdown
  dataSet.forEach(function (k, i) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = k.principle;
    document.querySelector('#' + dropdownIds[2]).appendChild(opt);
  });

  // populate the legend
  legendData.reverse().map(function (l) {
    var li = document.createElement('li');
    var s = document.createElement('span');

    li.innerHTML = l.label;
    s.style.cssText = 'background-color: ' + l.color;
    li.insertBefore(s, null);
    document.querySelector(legendClass + ' ul').appendChild(li);
  });

  // Init categories based on the 3rd dropdown
  var d1 = document.getElementById(dropdownIds[0]);
  setLabels(document.querySelector('#' + dropdownIds[2]).value);

  // add event listeners
  document.querySelectorAll(dropdownClass).forEach(function (el) {
    // Read the defaults if any
    setState(_defineProperty({}, el.id, el.value));

    // Add an event listeners to selects
    el.addEventListener('change', function (evt) {
      setState(_defineProperty({}, evt.currentTarget.id, evt.currentTarget.value));

      // Principle dropdown, change categories and tiles
      if (evt.currentTarget.id === dropdownIds[2]) {
        setLabels(evt.currentTarget.value);
      }

      if (evt.currentTarget.id === dropdownIds[0]) {
        var _d = document.getElementById(dropdownIds[0]);
        setLabels(document.querySelector('#' + dropdownIds[2]).value);
      }

      // redraw
      setSeries();
    });
  });

  // add CSV download event listener
  document.querySelector(csvButtonClass).addEventListener('click', function (e) {
    chart.downloadCSV();
  });

  return {
    dataSet: dataSet,
    chart: chart,
    state: state,
    setState: setState,
    setLabels: setLabels,
    setSeries: setSeries
  };
};

(function () {
  var req = new XMLHttpRequest();
  req.overrideMimeType('application/json');
  req.open('GET', 'https://gist.githubusercontent.com/degliwe/948ddae614475ddb13003e8c624653cd/raw/e3da034f38682ed6917c624cf042824038cd5b58/talinn.json', true);
  req.onload = function () {
    doc = req.responseText; // for testing purposes only
    var TALLINNHI = init(JSON.parse(req.responseText), 'tallinn-chart__container', ['select1', 'select2', 'select3'], '.tallinn-chart__button--csv', '.tallinn-chart__selector-container', '.tallinn-chart__selector', '.tallinn-chart__country', '.tallinn-chart__description', '.tallinn-chart__body', 'All members', ['#0399FB', '#F13601'], '.tallinn-chart__legend', [{ color: '', label: '' }, { color: '#aaa', label: 'No data' }, { color: '#faa', label: 'Not started' }, { color: '#fc0', label: 'In progress' }, { color: '#BC7', label: 'Implemented' }], ['', 'No data', 'No progress (no steps taken yet,…)', 'Measures are being taken, in progress', 'Action implemented/completed']);

    // Draw
    TALLINNHI.setSeries();
  };
  req.send();
})();