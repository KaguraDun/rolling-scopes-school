import EventEmitter from './EventEmitter';
import request from './request';

export const EVENTS = {
  SUMMARY_LOADED: 'SUMMARY_LOADED',
  SUMMARY_LOADING: 'SUMMARY_LOADING',
  WORLDWIDE_LOADED: 'WORLDWIDE_LOADED',
  WORLDWIDE_LOADING: 'WORLDWIDE_LOADING',
  COUNTRIES_SUMMARY_LOADED: 'COUNTRIES_SUMMARY_LOADED',
  COUNTRIES_SUMMARY_LOADING: 'COUNTRIES_SUMMARY_LOADING',
  COUNTRIES_HISTORICAL_LOADED: 'COUNTRIES_HISTORICAL_LOADED',
  COUNTRIES_HISTORICAL_LOADING: 'COUNTRIES_HISTORICAL_LOADING',
  SELECTED_COUNTRY_CHANGED: 'SELECTED_COUNTRY_CHANGED',
  SELECTED_CASE_CHANGED: 'SELECTED_CASE_CHANGED',
  FLAGS_LOADED: 'FLAGS_LOADED',
  FLAGS_LOADING: 'FLAGS_LOADING',
};

const DISEASE_SH_URL = 'https://disease.sh/v3/covid-19';

export default class Store {
  constructor() {
    this.summary = null;
    this.selectedCountry = null;
    this.selectedCase = null;
    this.worldwide = null;
    this.countriesSummary = null;
    this.countriesHistorical = null;
    this.flags = null;
    this.eventEmitter = new EventEmitter();
  }

  init() {
    this.getSummary();
    this.getWorldwideHistorical();
    this.getCountriesSummary();
    this.getCountriesHistorical();
    this.getFlags();
  }

  getSummary() {
    this.eventEmitter.emit(EVENTS.SUMMARY_LOADING);
    request({ url: 'https://api.covid19api.com/summary' }).then((data) => {
      this.summary = data;
      this.eventEmitter.emit(EVENTS.SUMMARY_LOADED);
    });
  }

  setSelectedCountry(country) {
    this.selectedCountry = country;
    this.eventEmitter.emit(EVENTS.SELECTED_COUNTRY_CHANGED);
  }

  setSelectedCase(caseName){
    this.selectedCase = caseName;
    this.eventEmitter.emit(EVENTS.SELECTED_CASE_CHANGED);
  }

  getWorldwideHistorical() {
    this.eventEmitter.emit(EVENTS.WORLDWIDE_LOADING);
    request({
      url: `${DISEASE_SH_URL}/historical/all?lastdays=366`,
    }).then((data) => {
      this.worldwide = data;
      this.eventEmitter.emit(EVENTS.WORLDWIDE_LOADED);
    });
  }

  getCountriesSummary() {
    this.eventEmitter.emit(EVENTS.COUNTRIES_SUMMARY_LOADING);
    request({
      url: `${DISEASE_SH_URL}/countries?yesterday=true&twoDaysAgo=false`,
    }).then((data) => {
      this.countriesSummary = data;
      this.eventEmitter.emit(EVENTS.COUNTRIES_SUMMARY_LOADED);
    });
  }

  getCountriesHistorical() {
    this.eventEmitter.emit(EVENTS.COUNTRIES_HISTORICAL_LOADING);
    request({
      url: `${DISEASE_SH_URL}/historical?lastdays=all`,
    }).then((data) => {
      this.countriesHistorical = data;
      this.eventEmitter.emit(EVENTS.COUNTRIES_HISTORICAL_LOADED);
    });
  }

  getFlags() {
    this.eventEmitter.emit(EVENTS.FLAGS_LOADING);
    request({
      url: 'https://restcountries.eu/rest/v2/all?fields=name;population;flag',
    }).then((data) => {
      this.flags = data;
      this.eventEmitter.emit(EVENTS.FLAGS_LOADED);
    });
  }
}
