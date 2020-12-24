/* eslint-disable */
/* global L */
import './leaflet-providers';

import { EVENTS } from '../Store';

// original
// const CASES = [
//   'Total confirmed cases',
//   'Total deaths',
//   'Total recovered',
//   'Total cases per 100k',
//   'Total deaths per 100k',
//   'Total recovered per 100k',
//   'Today confirmed cases',
//   'Today deaths',
//   'Today recovered',
//   'Today cases per 100k',
//   'Today deaths per 100k',
//   'Today recovered per 100k',
// ];

const CASES = [
  'Total confirmed cases',
  'Total deaths',
  'Total recovered',
  'Today deaths',
  'Today recovered',
  'Today confirmed cases',
  'Total deaths per 100k',
  'Total recovered per 100k',
  'Total cases per 100k',
  'Today deaths per 100k',
  'Today recovered per 100k',
  'Today cases per 100k',
];
// const CASES = [
//   'Total deaths',
//   'Total recovered',
//   'Total confirmed cases',
//   'Today deaths',
//   'Today recovered',
//   'Today confirmed cases',
//   'Total deaths per 100k',
//   'Total recovered per 100k',
//   'Total cases per 100k',
//   'Today deaths per 100k',
//   'Today recovered per 100k',
//   'Today cases per 100k',
// ];

const ICONS = [
  './assets/icons/blueIcon.svg',
  './assets/icons/whiteIcon.svg',
  './assets/icons/greenIcon.svg',
  './assets/icons/redIcon.svg',
  './assets/icons/circle.svg',
];

export default class Map {
  constructor(map, store) {
    this.store = store;
    this.map = map;
    this.data = this.store.сountriesSummary;
    this.checkedCountry = this.store.selectedCountry;
    this.checkedCase = this.store.selectedCase;
    this.subscribe();
    this.chooseTheFunction = this.chooseTheFunction.bind(this);
    this.select = this.createDropDownMenu();
    this.mapContainer = document.getElementById('mapId');
    this.actualIconSize = null;
    this.select.value = CASES.ALL;
    this.createBunchOfIcons = this.createBunchOfIcons.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.mapOverLay = null;
    this.legend = null;
    this.markerOnFocus = null;
  }

  subscribe() {
    this.store.eventEmitter.addEvent(EVENTS.COUNTRIES_SUMMARY_LOADED, () => {
      this.data = this.store.countriesSummary;
      this.init();
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_COUNTRY_CHANGED, () => {
      this.checkedCountry = this.store.selectedCountry;
      this.countryOnFocus(this.checkedCountry);
      // console.log(this.checkedCountry);
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_CASE_CHANGED, () => {
      this.checkedCase = this.store.selectedCase;
      this.select.value = CASES[this.checkedCase];

      this.chooseTheFunction();
    });
  }

  async init() {
    const divMap = document.createElement('div');
    this.map.append(divMap);
    divMap.id = 'mapId';
    if (!this.data) return;
    this.createMap();
    this.createDropDownMenu();
    this.mapContainer.appendChild(this.select);
    this.createLegend();
    this.chooseTheFunction();
    this.createBunchOfIcons();
    this.getButtonResize();
  }

  getButtonResize() {
    const buttonResize = document.createElement('button');
    buttonResize.className = 'button-resize';
    buttonResize.innerHTML = '⛶';
    buttonResize.addEventListener('click', this.toggleFullScreen);
    this.mapContainer.appendChild(buttonResize);
  }

  toggleFullScreen() {
    this.mapContainer.classList.toggle('--full-screen');
    setTimeout(this.map.invalidateSize(true), 100);
  }

  createMap() {
    const southWest = L.latLng(-78.98155760646617, -170);
    const northEast = L.latLng(85.99346179538875, 180);
    const bounds = L.latLngBounds(southWest, northEast);
    this.map = L.map('mapId', {
      maxZoom: 15,
      minZoom: 2,
      zoomSnap: 0.25,
      maxBoundsViscosity: 0.5,
    })
      .setView([30, 0], 2.5)
      .setMaxBounds(bounds);
    const imageUrl = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

    L.tileLayer(imageUrl, {
      attribution: `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, 
        &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; 
        <a href="http://openstreetmap.org">OpenStreetMap</a> contributors`,
    }).addTo(this.map);
    const imageBounds = [
      [40.712216, -74.22655],
      [40.773941, -74.12544],
    ];
    L.imageOverlay(imageUrl, imageBounds).addTo(this.map);

    this.mapOverLay = L.layerGroup().addTo(this.map);
    this.markerOnFocus = L.layerGroup().addTo(this.map);
    this.markerOnFocus.addEventListener('click', () => {
      this.markerOnFocus.clearLayers();
    });
  }

  createLegend(iconUrl, value) {
    this.legend = L.control({ position: 'bottomright' });
    this.legend.onAdd = function () {
      const legendDiv = L.DomUtil.create('div', 'legend');
      legendDiv.classList.add('legend');
      const legendTitle = document.createElement('div');
      legendTitle.classList.add('legend__title');
      legendTitle.textContent = `${value}`;
      const firstLine = document.createElement('div');
      firstLine.innerHTML = `<img src=${iconUrl} width="35"> 
      <span>  > 700 000</span></div><br>`;

      const secondLine = document.createElement('div');
      secondLine.innerHTML = `<img src=${iconUrl} width="33"> 
      <span>  > 350 000 - 700 000</span></div><br>`;

      const thirdLine = document.createElement('div');
      thirdLine.innerHTML = `<img src=${iconUrl} width="31"> 
      <span>  > 100 000 - 350 000</span></div><br>`;

      const fourthLine = document.createElement('div');
      fourthLine.innerHTML = `<img src=${iconUrl} width="29">
       <span>  > 50 000 - 100 000</span></div><br>`;

      const fifthLine = document.createElement('div');
      fifthLine.innerHTML = `<img src=${iconUrl} width="27"> 
      <span>  > 10 000 - 50 000</span></div><br>`;

      const sixthLine = document.createElement('div');
      sixthLine.innerHTML = `<img src=${iconUrl} width="25"> 
      <span>  > 1 000 - 10 000</span></div><br>`;

      const seventhLine = document.createElement('div');
      seventhLine.innerHTML = `<img src=${iconUrl} width="23"> 
      <span>  > 500 - 1000</span></div><br>`;

      const eighthLine = document.createElement('div');
      eighthLine.innerHTML = `<img src=${iconUrl} width="21"> 
      <span>  > 1- 1 000</span></div><br>`;

      legendDiv.append(
        legendTitle,
        firstLine,
        secondLine,
        thirdLine,
        fourthLine,
        fifthLine,
        sixthLine,
        seventhLine,
        eighthLine,
      );
      return legendDiv;
    };

    this.legend.addTo(this.map);
  }

  createDropDownMenu() {
    this.select = document.createElement('select');
    this.select.classList.add('drop__menu');

    const option1 = document.createElement('option');
    option1.innerText = CASES[0];
    option1.value = CASES[0];

    const option2 = document.createElement('option');
    option2.innerText = CASES[1];
    option2.value = CASES[1];

    const option3 = document.createElement('option');
    option3.innerText = CASES[2];
    option3.value = CASES[2];

    const option4 = document.createElement('option');
    option4.innerText = CASES[3];
    option4.value = CASES[3];

    const option5 = document.createElement('option');
    option5.innerText = CASES[4];
    option5.value = CASES[4];

    const option6 = document.createElement('option');
    option6.innerText = CASES[5];
    option6.value = CASES[5];

    const option7 = document.createElement('option');
    option7.innerText = CASES[6];
    option7.value = CASES[6];

    const option8 = document.createElement('option');
    option8.innerText = CASES[7];
    option8.value = CASES[7];

    const option9 = document.createElement('option');
    option9.innerText = CASES[8];
    option9.value = CASES[8];

    const option10 = document.createElement('option');
    option10.innerText = CASES[9];
    option10.value = CASES[9];

    const option11 = document.createElement('option');
    option11.innerText = CASES[10];
    option11.value = CASES[10];

    const option12 = document.createElement('option');
    option12.innerText = CASES[11];
    option12.value = CASES[11];

    this.select.append(
      option1,
      option2,
      option3,
      option4,
      option5,
      option6,
      option7,
      option8,
      option9,
      option10,
      option11,
      option12,
    );
    this.select.addEventListener('change', this.chooseTheFunction);
    return this.select;
  }

  // eslint-disable-next-line consistent-return
  chooseTheFunction() {
    if (this.select.value === CASES[0]) {
      return this.selectedPageRender(CASES[0], ICONS[1]);
    }
    if (this.select.value === CASES[1]) {
      return this.selectedPageRender(CASES[1], ICONS[2]);
    }
    if (this.select.value === CASES[2]) {
      return this.selectedPageRender(CASES[2], ICONS[0]);
    }
    if (this.select.value === CASES[3]) {
      return this.selectedPageRender(CASES[3], ICONS[1]);
    }
    if (this.select.value === CASES[4]) {
      return this.selectedPageRender(CASES[4], ICONS[2]);
    }
    if (this.select.value === CASES[5]) {
      return this.selectedPageRender(CASES[5], ICONS[0]);
    }
    if (this.select.value === CASES[6]) {
      return this.selectedPageRender(CASES[6], ICONS[1]);
    }
    if (this.select.value === CASES[7]) {
      return this.selectedPageRender(CASES[7], ICONS[2]);
    }
    if (this.select.value === CASES[8]) {
      return this.selectedPageRender(CASES[8], ICONS[0]);
    }
    if (this.select.value === CASES[9]) {
      return this.selectedPageRender(CASES[9], ICONS[1]);
    }
    if (this.select.value === CASES[10]) {
      return this.selectedPageRender(CASES[10], ICONS[2]);
    }
    if (this.select.value === CASES[11]) {
      return this.selectedPageRender(CASES[11], ICONS[0]);
    }
  }

  selectedPageRender(value, iconUrl) {
    this.mapOverLay.clearLayers();
    this.createBunchOfIcons(value);
    this.map.removeControl(this.legend);
    this.createLegend(iconUrl, value);
  }

  createBunchOfIcons(value) {
    this.data.forEach((element) => {
      const mlnPopulation = 100000;
      const allData = element.countryInfo;
      const { cases } = element;
      const { country } = element;
      const { deaths } = element;
      const { recovered } = element;
      const { todayDeaths } = element;
      const { todayRecovered } = element;
      const { todayCases } = element;
      const { casesPerOneMillion } = element;
      const casesPerOneThousand = casesPerOneMillion / 10;
      const { deathsPerOneMillion } = element;
      const deathsPerOneThousand = deathsPerOneMillion / 10;
      const realpopulation = element.population;
      const population = realpopulation > 0 ? realpopulation : 1;

      // eslint-disable-next-line max-len
      const recoveredPerThousand =
        Math.round((casesPerOneThousand - deathsPerOneThousand) * 10) / 10;

      const todayRecoveredPer100k = Math.round(mlnPopulation / (population / todayRecovered)) / 10;
      const todayDeathsPer100k = Math.round(mlnPopulation / (population / todayDeaths)) / 10;
      const todayCasesPer100k = Math.round(mlnPopulation / (population / todayCases)) / 10;
      const mainArr = [allData.lat, allData.long, country];

      if (value === 'Total confirmed cases') {
        this.createDefaultRedIcon(...mainArr, cases, deaths);
      } else if (value === 'Total deaths') {
        this.createWhiteIcon(...mainArr, deaths);
      } else if (value === 'Total recovered') {
        this.createGreenIcon(...mainArr, recovered);
      } else if (value === 'Total cases per 100k') {
        this.createRedIcon(...mainArr, casesPerOneThousand);
      } else if (value === 'Total deaths per 100k') {
        this.createWhiteIcon(...mainArr, deathsPerOneThousand);
      } else if (value === 'Total recovered per 100k') {
        this.createGreenIcon(...mainArr, recoveredPerThousand);
      } else if (value === 'Today confirmed cases') {
        this.createRedIcon(...mainArr, todayCases);
      } else if (value === 'Today deaths') {
        this.createWhiteIcon(...mainArr, todayDeaths);
      } else if (value === 'Today recovered') {
        this.createGreenIcon(...mainArr, todayRecovered);
      } else if (value === 'Today cases per 100k') {
        this.createRedIcon(...mainArr, todayCasesPer100k);
      } else if (value === 'Today deaths per 100k') {
        this.createWhiteIcon(...mainArr, todayDeathsPer100k);
      } else if (value === 'Today recovered per 100k') {
        this.createGreenIcon(...mainArr, todayRecoveredPer100k); // Great
      }
    });
  }

  createIcon(lat, long, country, summaryCases, text, iconUrl) {
    const actualText = `<b>${country}</b> ${text}`;
    const icon = L.icon({
      iconUrl,
      iconSize: this.getIconSize(summaryCases),
      iconAnchor: [10, 10],
      popupAnchor: [10, 0],
    });

    return L.marker([lat, long], { icon })
      .addTo(this.mapOverLay)
      .bindTooltip(actualText, { className: 'tool__tip' });
  }

  createDefaultRedIcon(lat, long, country, cases, deaths) {
    const text = ` <br>  <b>Cases:</b> ${cases === null ? 0 : cases}<br><b>Deaths:</b> ${deaths}`;
    this.createIcon(lat, long, country, cases, text, ICONS[0]);
  }

  createRedIcon(lat, long, country, cases) {
    const text = ` <br>  <b>Cases:</b> ${cases}`;
    this.createIcon(lat, long, country, cases, text, ICONS[0]);
  }

  createWhiteIcon(lat, long, country, deaths) {
    const text = `<br>  <b>Deaths:</b> ${deaths}`;
    this.createIcon(lat, long, country, deaths, text, ICONS[1]);
  }

  createGreenIcon(lat, long, country, recovered) {
    const text = `<br>  <b>Recovered:</b> ${recovered}`;
    this.createIcon(lat, long, country, recovered, text, ICONS[2]);
  }

  // eslint-disable-next-line consistent-return,class-methods-use-this
  getIconSize(cases) {
    if (cases > 700000) {
      return [35, 35];
    }
    if (cases > 350000 && cases <= 700000) {
      return [33, 33];
    }
    if (cases > 100000 && cases <= 350000) {
      return [31, 31];
    }
    if (cases > 50000 && cases <= 100000) {
      return [29, 29];
    }
    if (cases > 10000 && cases <= 50000) {
      return [27, 27];
    }
    if (cases > 1000 && cases <= 10000) {
      return [25, 25];
    }
    if (cases > 500 && cases <= 1000) {
      return [23, 23];
    }
    if (cases >= 0 && cases <= 500) {
      return [21, 21];
    }
  }

  countryOnFocus(country) {
    this.data.forEach((element) => {
      if (element.country === country) {
        const coordinates = element.countryInfo;
        const { lat } = coordinates;
        const { long } = coordinates;
        this.map.setView([lat, long], 4);
        // this.createIconOnFocus(lat, long, element.country);
      }
    });
  }
}
