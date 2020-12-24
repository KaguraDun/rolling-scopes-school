import { EVENTS } from '../Store';
import getRSSNews from '../RSSNews';

const State = {
  CASES: 'cases',
    DEATHS: 'deaths',
    RECOVERED: 'recovered',
    TODAY_DEATHS: 'todayDeaths',
    TODAY_RECOVERED: 'todayRecovered',
    TODAY_CONFIRMED: 'todayCases',
    DEATHS_100: 'deathsPerOneMillion',
    RECOVERED_100: 'recoveredPerOneMillion',
    CASES_100: 'casesPerOneMillion',
    TODAY_DEATHS_100: 'todayDeathsPer100k',
    TODAY_RECOVERED_100: 'todayRecoveredPer100k',
    TODAY_CASES_100: 'todayCasesPer100k',
  };

const stateTitles = {
  [State.CASES]: 'Total Confirmed',
    [State.DEATHS]: 'Total Deaths',
    [State.RECOVERED]: 'Total Recovered',
    [State.TODAY_DEATHS]: 'Today Deaths',
    [State.TODAY_RECOVERED]: 'Today Recovered',
    [State.TODAY_CONFIRMED]: 'Today Confirmed',
    [State.DEATHS_100]: 'Per 100k deaths',
    [State.RECOVERED_100]: 'Per 100k recovered',
    [State.CASES_100]: 'Per 100k cases',
    [State.TODAY_DEATHS_100]: 'Per 100k deaths today',
    [State.TODAY_RECOVERED_100]: 'Per 100k recovered today',
    [State.TODAY_CASES_100]: 'Per 100k cases today',
  };

const DATA_ATTRIBUTE = 'country';

export default class Table {
  constructor(table, store) {
    this.currentStateIndex = 0;
    this.store = store;
    this.data = this.store.countriesSummary;
    this.checkedCountry = this.store.selectedCountry;
    this.checkedCase = this.store.selectedCase;
    this.subscribe();
    this.table = table;
    this.statisticContainer = table.querySelector('.table__statistic');
    this.newsContainer = table.querySelector('.table__news');
    this.state = State.DEATHS;
    this.selected = '';
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  subscribe() {
    this.store.eventEmitter.addEvent(EVENTS.COUNTRIES_SUMMARY_LOADED, () => {
      this.data = this.store.countriesSummary;
      this.render();
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_COUNTRY_CHANGED, () => {
      this.checkedCountry = this.store.selectedCountry;
      this.render();
    });

    this.store.eventEmitter.addEvent(EVENTS.SELECTED_CASE_CHANGED, () => {
      this.checkedCase = this.store.selectedCase;

      const stateValues = Object.values(State);
      this.state = stateValues[this.checkedCase];

      this.render();
    });
  }

  static isOnePer100k(state) {
    return [State.CASES_100, State.DEATHS_100, State.RECOVERED_100].includes(state);
  }

  static isOnePer100kToday(state) {
    return [State.TODAY_CASES_100, State.TODAY_DEATHS_100, State.TODAY_RECOVERED_100].includes(
      state,
    );
  }

  getTitleHTML() {
    let globalValue = Math.round(this.data.reduce((acc, item) => acc + item[this.state], 0));

    if (Table.isOnePer100k(this.state)) {
      globalValue /= 10;
    }

    if (Table.isOnePer100kToday(this.state)) {
      globalValue = '<br/>';
    }

    let titleBlock = `
    <div class="${this.state}">
        <div class="statistic__title">
            <h3 class="global__title">${stateTitles[this.state]}</h3>
            <div class="table__control">
                <div class="table_arrow left__arrow"><</div>
                <div class="table_arrow right__arrow">></div>
            </div>
        </div>
        <span class="global__number ${this.state}">${globalValue}</span>
    </div>`;

    if (this.checkedCountry) {
      titleBlock = '';
    }

    return `
    <div class="table__wrapper">
        ${titleBlock}                                    
        <div class="country__table">
            <div>${this.getTableContentHTML()}</div>
        </div>
    </div>`;
  }

  addEventListeners() {
    const arrows = this.statisticContainer.querySelectorAll('.left__arrow, .right__arrow');
    arrows.forEach((arrow) => {
      arrow.addEventListener('click', (e) => {
        let addValue = 1;
        if (e.currentTarget.classList.contains('left__arrow')) {
          addValue = -1;
        }

        const stateValues = Object.values(State);

        this.currentStateIndex += addValue;

        if (this.currentStateIndex >= stateValues.length) {
          this.currentStateIndex = 0;
        }

        if (this.currentStateIndex < 0) {
          this.currentStateIndex = stateValues.length - 1;
        }

        this.state = stateValues[this.currentStateIndex];

        this.store.setSelectedCase(this.currentStateIndex);

        this.render();
      });
    });

    const closeCountry = this.statisticContainer.querySelector('.close__country');
    closeCountry?.addEventListener('click', () => {
      this.store.setSelectedCountry(null);
    });

    const country = this.statisticContainer.querySelectorAll('.country');
    country.forEach((item) => {
      item.addEventListener('click', (e) => {
        this.store.setSelectedCountry(e.currentTarget.dataset[DATA_ATTRIBUTE]);
      });
    });
  }

  getTableContentHTML() {
    if (this.checkedCountry) {
      return this.getContentByCountryHTML();
    }

    const data = this.data.map((country) => {
      let value = country[this.state];
      if (Table.isOnePer100k(this.state)) {
        value /= 10;
      }
      if (Table.isOnePer100kToday(this.state)) {
        value = country[this.state.replace('Per100k', '')];
        value /= country.population / 100000;
      }
      return {
        value: Math.floor(value * 10) / 10,
        country: country.country,
        flag: country.countryInfo.flag,
      };
    });

    data.sort((a, b) => {
      if (a.value > b.value) {
        return -1;
      }
      return 1;
    });

    return data
      .map(
        ({ country, value, flag }) => `
            <div class="country" data-${DATA_ATTRIBUTE}="${country}">
                <div class="country__title">
                    <img src="${flag}" alt="flag" class="country__flag">
                    ${country}
                </div>
                <div class="country__total-number ${this.state}">
                    ${value} 
                </div>
            </div>`,
      )
      .join('');
  }

  getContentByCountryHTML() {
    const currentCountry = this.data.find((item) => this.checkedCountry === item.country);
    const countryItemsContent = Object.values(State).map((item) => {
      let value = currentCountry[item];
      if (Table.isOnePer100k(item)) {
        value /= 10;
      }
      if (Table.isOnePer100kToday(item)) {
        value = currentCountry[item.replace('Per100k', '')];
        value /= currentCountry.population / 100000;
      }
      return `
            <div class="info__item ${item}">
                <span class="item__title ${item}__title Total${item}">
                    ${stateTitles[item]}
                </span>
                <span class="item__total ${item}__total">${Math.floor(value * 10) / 10}</span>
            </div>`;
    });
    return `
        <div class="table__wrapper">
            <div class="countryBlock">
            <div class="country__title">
                <span class="country_title">${this.checkedCountry}</span>
                <span class="close__country">x</span>
            </div>
                
                <div class="info">
                    ${countryItemsContent.join('')}
                </div>
            </div>
        </div>`;
  }

  getButtonResize() {
    const buttonResize = document.createElement('button');
    buttonResize.className = 'button-resize';
    buttonResize.innerHTML = '⛶';
    buttonResize.addEventListener('click', this.toggleFullScreen);
    this.table.appendChild(buttonResize);
  }

  toggleFullScreen() {
    this.table.classList.toggle('--full-screen');
  }

  render() {
    if (!this.data) {
      return;
    }

    this.statisticContainer.innerHTML = this.getTitleHTML();
    this.getButtonResize();
    this.addEventListeners();
    getRSSNews().then((html) => {
      this.newsContainer.innerHTML = `
        <h3 class="news__title">News</h3>
        <div class="news__content">${html}</div>`;
    });
  }
}
