/* eslint-disable */
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { EVENTS } from '../Store';
import renderElement from '../helpers/renderElement';

const cases = [
  'Total Confirmed',
  'Total Deaths',
  'Total Recovered',
  'Today Confirmed',
  ' Today Deaths',
  'Today Recovered',
  'Total Confirmed per hundred thousand',
  'Total Deaths per hundred thousand',
  'Total Recovered per hundred thousand',
  'Today Confirmed per hundred thousand',
  'Today Deaths per hundred thousand',
  'Today Recovered per hundred thousand',
];

function createKeyboard() {
  function onChange(input) {
    const currentValue = document.querySelector('.sidebar-input').value + input[input.length - 1];
    document.querySelector('.sidebar-input').value = currentValue;
  }

  const keyboard = new Keyboard({
    onChange: (input) => onChange(input),
    // eslint-disable-next-line no-use-before-define
    onKeyPress: (button) => onKeyPress(button),
    layout: {
      default: [
        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        '{tab} q w e r t y u i o p [ ] \\',
        "{lock} a s d f g h j k l ; ' {enter}",
        '{shift} z x c v b n m , . / {shift}',
        '.com @ {space}',
      ],
      shift: [
        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
        '{tab} Q W E R T Y U I O P { } |',
        '{lock} A S D F G H J K L : " {enter}',
        '{shift} Z X C V B N M < > ? {shift}',
        '.com @ {space}',
      ],
      lock: [
        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        '{tab} Q W E R T Y U I O P [ ] \\',
        "{lock} A S D F G H J K L ; ' {enter}",
        '{shift} Z X C V B N M , . / {shift}',
        '.com @ {space}',
      ],
    },
  });

  function handleShiftButton() {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'shift' ? 'default' : 'shift';

    keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }

  function handleCapsButton() {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'lock' ? 'default' : 'lock';

    keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }

  function onKeyPress(button) {
    /**
     * Shift functionality
     */
    if (button === '{shift}') handleShiftButton();

    /**
     * Caps functionality
     */
    if (button === '{lock}') handleCapsButton();
  }
}

export default class RenderSideBar {
  constructor(sidebar, store) {
    this.sidebar = sidebar;
    this.rootElement = null;
    this.store = store;
    this.summary = this.store.countriesSummary;
    this.flags = null;
    this.subscribe();
    this.case = 'Total Confirmed';
    this.buttons = null;
    this.table = null;
    this.tableScroll = null;
    this.tableHeader = null;
    this.input = null;
    this.currentCaseIndex = 0;
    this.sortColumnName = 1;
    this.filterCountryName = '';
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onInput = this.onInput.bind(this);
    this.toogleFullScreen = this.toogleFullScreen.bind(this);
    this.onCoutrySelect = this.onCoutrySelect.bind(this);
  }

  subscribe() {
    this.store.eventEmitter.addEvent(EVENTS.COUNTRIES_SUMMARY_LOADED, () => {
      this.summary = this.store.countriesSummary;
      this.render();
    });
  }

  toogleFullScreen() {
    this.rootElement.classList.toggle('full-screen');
  }

  createTableHeader() {
    if (this.rootElement === null) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      this.rootElement = wrapper;
    }
    const keyboardButton = document.createElement('button');
    const thead = document.createElement('div');
    const text = document.createElement('p');

    keyboardButton.innerHTML = '▼';
    text.innerText = `${this.case} by Country`;
    text.classList.add('table-header');
    keyboardButton.classList.add('keyboard-button');

    keyboardButton.addEventListener('click', this.onClick);

    thead.appendChild(text);
    thead.appendChild(keyboardButton);
    this.keyboardButton = keyboardButton;
    this.tableHeader = thead;
  }

  render() {
    if (!this.summary) {
      return;
    }
    this.createTableHeader();
    this.createButtons();
    this.createinput();

    this.table = document.createElement('table');
    this.table.appendChild(this.tableHeader);

    this.createTableBody();

    const resizeButton = renderElement('button', ['sidebar-resize'], this.rootElement, '⛶');
    resizeButton.addEventListener('click', this.toogleFullScreen);

    this.rootElement.appendChild(this.input);
    this.rootElement.appendChild(this.keyboard);
    this.input.focus();
    this.rootElement.appendChild(this.keyboard);
    this.rootElement.appendChild(this.table);
    this.rootElement.appendChild(this.buttons);
    this.sidebar.appendChild(this.rootElement);
    this.input.focus();
    createKeyboard();
  }

  createButtons() {
    const buttonContainer = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const text = document.createElement('span');

    buttonContainer.classList.add('sidebar-buttons');
    button1.classList.add('button-left');
    button1.classList.add('button-onclick');
    button2.classList.add('button-right');
    button2.classList.add('button-onclick');

    button1.innerText = '<';
    button2.innerText = '>';
    text.innerText = 'Prev/Next Case';

    buttonContainer.append(button1, text, button2);
    buttonContainer.addEventListener('click', this.onButtonClick);

    this.buttons = buttonContainer;
  }

  onButtonClick({ target }) {
    if (target.classList.contains('button-left')) {
      this.currentCaseIndex += 1;
    }

    if (target.classList.contains('button-right')) {
      this.currentCaseIndex -= 1;
    }

    this.changeCase();
  }

  changeCase() {
    this.case = cases[Math.abs(this.currentCaseIndex) % 12];
    this.rootElement.innerHTML = '';

    this.createTableBody();

    this.render();
  }

  sortCases(arrayOfCountries) {
    let sortedArray;
    if (document.querySelector('.sidebar-input') !== null) {
      this.filterCountryName = document.querySelector('.sidebar-input').value;
    }
    const newArray = arrayOfCountries.filter((item) =>
      item.country.startsWith(this.filterCountryName),
    );

    if (this.case === 'Total Confirmed') {
      sortedArray = newArray.sort((a, b) => b.cases - a.cases);
    } else if (this.case === 'Total Deaths') {
      sortedArray = newArray.sort((a, b) => b.deaths - a.deaths);
    } else if (this.case === 'Total Recovered') {
      sortedArray = newArray.sort((a, b) => b.recovered - a.recovered);
    } else if (this.case === 'Today Confirmed') {
      sortedArray = newArray.sort((a, b) => b.todayCases - a.todayCases);
    } else if (this.case === 'Today Deaths') {
      sortedArray = newArray.sort((a, b) => b.todayDeaths - a.todayDeaths);
    } else if (this.case === 'Today Recovered') {
      sortedArray = newArray.sort((a, b) => b.todayRecovered - a.todayRecovered);
    } else if (this.case === 'Total Confirmed per hundred thousand') {
      sortedArray = newArray.sort((a, b) => b.casesPerOneMillion - a.casesPerOneMillion);
    } else if (this.case === 'Total Deaths per hundred thousand') {
      sortedArray = newArray.sort((a, b) => b.recoveredPerOneMillion - a.recoveredPerOneMillion);
    } else if (this.case === 'Total Recovered per hundred thousand') {
      sortedArray = newArray.sort((a, b) => b.deathsPerOneMillion - a.deathsPerOneMillion);
    } else if (this.case === 'Today Confirmed per hundred thousand') {
      sortedArray = newArray.sort(
        (a, b) =>
          Math.round(1000000 / (b.population / b.todayCases)) / 10 -
          Math.round(1000000 / (a.population / a.todayCases)) / 10,
      );
    } else if (this.case === 'Today Deaths per hundred thousand') {
      sortedArray = newArray.sort(
        (a, b) =>
          Math.round(1000000 / (b.population / b.todayDeaths)) / 10 -
          Math.round(1000000 / (a.population / a.todayDeaths)) / 10,
      );
    } else {
      sortedArray = newArray.sort(
        (a, b) =>
          Math.round(1000000 / (b.population / b.todayRecovered)) / 10 -
          Math.round(1000000 / (a.population / a.todayRecovered)) / 10,
      );
    }

    return sortedArray;
  }

  createTableBody() {
    const tableScroll = document.createElement('div');
    const table = document.createElement('tbody');

    table.classList.add('country-list');
    table.classList.add('table-sort');
    tableScroll.classList.add('table-scroll');

    const cloneCountries = this.sortCases(this.summary);

    cloneCountries.forEach((country) => {
      const trbody = document.createElement('tr');
      const tdName = document.createElement('td');
      const tdCases = document.createElement('td');
      const img = document.createElement('img');

      img.src = country.countryInfo.flag;

      tdName.innerText = country.country;
      tdName.classList.add('left-cell');

      if (this.case === 'Total Confirmed') {
        tdCases.innerText = country.cases;
      } else if (this.case === 'Total Deaths') {
        tdCases.innerText = country.deaths;
      } else if (this.case === 'Total Recovered') {
        tdCases.innerText = country.recovered;
      } else if (this.case === 'Today Confirmed') {
        tdCases.innerText = country.todayCases;
      } else if (this.case === 'Today Deaths') {
        tdCases.innerText = country.todayDeaths;
      } else if (this.case === 'Today Recovered') {
        tdCases.innerText = country.todayRecovered;
      } else if (this.case === 'Total Confirmed per hundred thousand') {
        tdCases.innerText = Math.round(country.casesPerOneMillion / 10);
      } else if (this.case === 'Total Recovered per hundred thousand') {
        tdCases.innerText = Math.round(country.deathsPerOneMillion / 10);
      } else if (this.case === 'Total Deaths per hundred thousand') {
        tdCases.innerText = Math.round(country.recoveredPerOneMillion / 10);
      } else if (this.case === 'Today Confirmed per hundred thousand') {
        tdCases.innerText = Math.round(1000000 / (country.population / country.todayCases)) / 10;
      } else if (this.case === 'Today Deaths per hundred thousand') {
        tdCases.innerText = Math.round(1000000 / (country.population / country.todayDeaths)) / 10;
      } else {
        // eslint-disable-next-line max-len
        tdCases.innerText =
          Math.round(1000000 / (country.population / country.todayRecovered)) / 10;
      }

      img.classList.add('contry-flag');

      tdName.appendChild(img);
      tdName.addEventListener('click', this.onCoutrySelect);
      trbody.append(tdName, tdCases);

      table.appendChild(trbody);
    });

    tableScroll.appendChild(table);
    this.table.appendChild(tableScroll);
  }

  onCoutrySelect({ target }) {
    this.store.setSelectedCountry(target.innerText);
  }

  createinput() {
    if (this.input) {
      return;
    }
    const input = document.createElement('input');
    const keyboard = document.createElement('div');

    keyboard.classList.add('simple-keyboard');
    input.setAttribute('class', 'sidebar-input');
    input.setAttribute('rows', '1');
    input.setAttribute('colls', '20');
    input.setAttribute('autofocus', '');
    input.setAttribute('placeholder', 'Enter country name');

    this.input = input;
    this.keyboard = keyboard;
    input.addEventListener('input', this.onInput);
  }

  onClick() {
    const el = document.querySelector('.simple-keyboard');
    this.sp = el;
    if (el.style.top === '80rem') {
      el.style.top = '28rem';
    } else {
      el.style.top = '80rem';
    }
  }

  onInput(e) {
    this.filterCountryName = e.target.value;

    this.rootElement.innerHTML = '';

    this.createTableBody();

    this.render();
  }
}
