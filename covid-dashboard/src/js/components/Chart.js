import ChartLib from 'chart.js';
import { EVENTS } from '../Store';
import renderElement from '../helpers/renderElement';

const CASES = {
  CASES: 'Total cases',
  DEATHS: 'Total deaths',
  RECOVERED: 'Total recovered',
  DEATHS_LAST_DAY: 'Deaths for each day',
  RECOVERED_LAST_DAY: 'Recovered for each day',
  CASES_LAST_DAY: 'Cases for each day',
  DEATHS_PER_100K: 'Total deaths per 100k',
  RECOVERED_PER_100K: 'Total recovered per 100k',
  CASES_PER_100K: 'Total cases per 100k',
  DEATHS_LAST_DAY_PER_100K: 'Deaths for each day per 100k',
  RECOVERED_LAST_DAY_PER_100K: 'Recovered for each day per 100k',
  CASES_LAST_DAY_PER_100K: 'Cases for each day per 100k',
};

const COLOR__YELLOW = '#094074';
const CHART_OPTIONS = {
  type: 'line',
  data: {
    datasets: [
      {
        backgroundColor: [COLOR__YELLOW],
        borderColor: [COLOR__YELLOW],
        borderWidth: 1,
      },
    ],
  },
  options: {
    tooltips: {
      titleFontSize: 20,
      bodyFontSize: 18,
    },
    elements: {
      point: {
        fontSize: 20,
        borderColor: '#1CB5E0',
        backgroundColor: 'white',
      },
    },
    legend: {
      display: false,
      labels: {
        fontSize: 20,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'month',
          },
          ticks: {
            fontSize: 18,
            autoSkip: true,
            maxTicksLimit: 12,
            fontColor: 'white',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontSize: 16,
            beginAtZero: true,
            fontColor: 'white',
          },
        },
      ],
    },
  },
};

const PER_100_THOUSANDS = 100000;
const COUNTRY_WORLDWIDE = 'Worldwide';

function calculatePerEachDay(object) {
  let prev = 0;

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      let difference = value - prev;
      if (difference < 0) difference = 0;
      prev = value;

      return [key, difference];
    }),
  );
}

function calculatePer100Thousands(object, population) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      const calculateValue = (value / population) * PER_100_THOUSANDS;

      return [key, calculateValue.toFixed(1)];
    }),
  );
}

function formateDate(dateArr) {
  return dateArr.map((element) => new Date(element).toDateString());
}

function calcualteCountryDataWithProvince(countriesArr) {
  if (countriesArr.length === 1) return countriesArr[0].timeline;

  const resultObj = {
    cases: {},
    deaths: {},
    recovered: {},
  };

  countriesArr.forEach((province) => {
    Object.entries(province.timeline.cases).forEach(([key, value]) => {
      if (resultObj.cases[key] === undefined) resultObj.cases[key] = 0;
      resultObj.cases[key] += value;
    });

    Object.entries(province.timeline.deaths).forEach(([key, value]) => {
      if (resultObj.deaths[key] === undefined) resultObj.deaths[key] = 0;
      resultObj.deaths[key] += value;
    });

    Object.entries(province.timeline.recovered).forEach(([key, value]) => {
      if (resultObj.recovered[key] === undefined) resultObj.recovered[key] = 0;
      resultObj.recovered[key] += value;
    });
  });

  return resultObj;
}

export default class Chart {
  constructor(parent, store) {
    this.store = store;
    this.dataWorldwide = this.store.worldwide;
    this.dataCountriesSummary = this.store.сountriesSummary;
    this.dataCountriesHistorical = this.store.countriesHistorical;
    this.dataCountries = null;
    this.dataPopulation = null;
    this.worldwidePopulation = null;
    this.checkedCountry = this.store.selectedCountry;
    this.checkedCase = this.store.selectedCase;
    this.subscribe();
    this.parent = parent;
    this.chartInner = null;
    this.chartContainer = null;
    this.selectType = null;
    this.selectCountry = null;
    this.setDataForChart = this.setDataForChart.bind(this);
    this.toogleFullScreen = this.toogleFullScreen.bind(this);
  }

  getCountries() {
    if (!this.dataCountriesSummary) return null;

    const countries = {};

    this.dataCountriesSummary.forEach((element, id) => {
      countries[id] = element.country;
    });

    return countries;
  }

  getPopulation() {
    if (!this.dataCountriesSummary) return null;

    const population = {};

    this.dataCountriesSummary.forEach((element) => {
      population[element.country] = element.population;
    });

    return population;
  }

  calculateWorldwidePopulation() {
    if (!this.dataPopulation) return null;

    let worldwidePopulation = 0;

    Object.values(this.dataPopulation).forEach((element) => {
      worldwidePopulation += element;
    });

    return worldwidePopulation;
  }

  subscribe() {
    this.store.eventEmitter.addEvent(EVENTS.WORLDWIDE_LOADED, () => {
      this.dataWorldwide = this.store.worldwide;
    });

    this.store.eventEmitter.addEvent(EVENTS.COUNTRIES_SUMMARY_LOADED, () => {
      this.dataCountriesSummary = this.store.countriesSummary;
      this.dataPopulation = this.getPopulation();
      this.worldwidePopulation = this.calculateWorldwidePopulation();
    });

    this.store.eventEmitter.addEvent(EVENTS.COUNTRIES_HISTORICAL_LOADED, () => {
      this.dataCountriesHistorical = this.store.countriesHistorical;
      this.dataCountries = this.getCountries();

      this.render();
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_COUNTRY_CHANGED, () => {
      this.checkedCountry = this.store.selectedCountry;

      if (this.checkedCountry === this.selectCountry.value) return;

      this.render();
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_CASE_CHANGED, () => {
      this.checkedCase = this.store.selectedCase;

      if (this.checkedCase === this.selectType.value) return;
      this.render();
    });
  }

  toogleFullScreen() {
    this.chartInner.classList.toggle('--full-screen');
  }

  setDataForChart() {
    const type = this.selectType.value;
    const country = this.selectCountry.value;
    const isWorldwide = country === COUNTRY_WORLDWIDE;

    if (!isWorldwide) this.store.setSelectedCountry(country);
    this.store.setSelectedCase(type);

    const countriesArr = this.dataCountriesHistorical.filter(
      (data) => data.country === country || data.province === country.toLowerCase(),
    );

    const dataCases = isWorldwide
      ? this.dataWorldwide
      : calcualteCountryDataWithProvince(countriesArr);

    const population = isWorldwide ? this.worldwidePopulation : this.dataPopulation[country];

    const getCases = dataCases.cases;
    const getDeaths = dataCases.deaths;
    const getRecovered = dataCases.recovered;

    const TYPE_CASES = {
      [CASES.CASES]: getCases,
      [CASES.DEATHS]: getDeaths,
      [CASES.RECOVERED]: getRecovered,
      [CASES.CASES_PER_100K]: calculatePer100Thousands(getCases, population),
      [CASES.DEATHS_PER_100K]: calculatePer100Thousands(getDeaths, population),
      [CASES.RECOVERED_PER_100K]: calculatePer100Thousands(getRecovered, population),
      [CASES.CASES_LAST_DAY]: calculatePerEachDay(getCases),
      [CASES.DEATHS_LAST_DAY]: calculatePerEachDay(getDeaths),
      [CASES.RECOVERED_LAST_DAY]: calculatePerEachDay(getRecovered),
      [CASES.CASES_LAST_DAY_PER_100K]: calculatePer100Thousands(
        calculatePerEachDay(getCases),
        population,
      ),
      [CASES.DEATHS_LAST_DAY_PER_100K]: calculatePer100Thousands(
        calculatePerEachDay(getDeaths),
        population,
      ),
      [CASES.RECOVERED_LAST_DAY_PER_100K]: calculatePer100Thousands(
        calculatePerEachDay(getRecovered),
        population,
      ),
    };

    const selectedType = Object.values(CASES)[type];
    const fetchData = TYPE_CASES[selectedType];
    const labelArray = formateDate(Object.keys(fetchData));
    const dataArray = Object.values(fetchData);

    this.renderChart(labelArray, dataArray);
  }

  render() {
    if (!this.dataWorldwide || !this.dataCountriesSummary || !this.dataCountriesHistorical) {
      this.parent.innerHTML = 'Loading...';
      setTimeout(this.render, 1000);
      return;
    }

    this.parent.innerHTML = '';

    this.chartInner = renderElement('div', ['chart__inner'], this.parent);
    this.selectType = renderElement('select', ['select-type'], this.chartInner);

    Object.values(CASES).forEach((element, index) => {
      const option = renderElement('option', ['select-type__option'], this.selectType, element);
      option.value = index;

      if (index === this.checkedCase) option.selected = true;
    });

    this.selectCountry = renderElement('select', ['select-country'], this.chartInner);

    const worldwideOption = renderElement(
      'option',
      ['select-country__option'],
      this.selectCountry,
      COUNTRY_WORLDWIDE,
    );

    worldwideOption.value = COUNTRY_WORLDWIDE;

    Object.values(this.dataCountries).forEach((value) => {
      const option = renderElement('option', ['select-country__option'], this.selectCountry, value);
      option.value = value;

      if (value === this.checkedCountry) option.selected = true;
    });

    this.selectCountry.addEventListener('change', this.setDataForChart);
    this.selectType.addEventListener('change', this.setDataForChart);

    const resizeButton = renderElement('button', ['button-resize'], this.chartInner, '⛶');

    resizeButton.addEventListener('click', this.toogleFullScreen);

    this.chartContainer = renderElement('div', ['chart__container'], this.chartInner);

    this.setDataForChart();
  }

  renderChart(labelArray, dataArray) {
    CHART_OPTIONS.data.labels = labelArray;
    CHART_OPTIONS.data.datasets[0].data = dataArray;

    this.chartContainer.innerHTML = '';

    const canvas = renderElement('canvas', [], this.chartContainer);
    const ctx = canvas.getContext('2d');

    /* eslint-disable no-unused-vars */
    const myChart = new ChartLib(ctx, CHART_OPTIONS);
    /* eslint-enable no-unused-vars */
  }
}
