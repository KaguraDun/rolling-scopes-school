import { EVENTS } from '../Store';

export default class Header {
  constructor(header, store) {
    this.header = header;
    this.store = store;
    this.checkedCountry = null;
    this.subscribe();
  }

  subscribe() {
    this.store.eventEmitter.addEvent(EVENTS.SELECTED_COUNTRY_CHANGED, () => {
      this.checkedCountry = this.store.selectedCountry;
      this.render();
    });
  }

  render() {
    const headerHtml = '<div class="header-panel">COVID-19 Dashboard</div>';
    this.header.innerHTML = headerHtml;
  }
}
