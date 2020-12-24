import Header from './Header';
import MapItem from './Map';
import Table from './Table';
import Chart from './Chart';
import Footer from './Footer';
import Sidebar from './Sidebar';

function createContainers() {
  const header = document.querySelector('.header');
  const sidebar = document.querySelector('.sidebar');
  const map = document.querySelector('.map');
  const table = document.querySelector('.table');
  const chart = document.querySelector('.chart');
  const footer = document.querySelector('.footer');

  return {
    header,
    sidebar,
    map,
    table,
    chart,
    footer,
  };
}

export default class Page {
  constructor(store) {
    this.store = store;
  }

  createChildren() {
    const { header, table, chart, map, footer, sidebar } = createContainers();
    this.header = new Header(header, this.store);
    this.table = new Table(table, this.store);
    this.chart = new Chart(chart, this.store);
    this.map = new MapItem(map, this.store);
    this.footer = new Footer(footer, this.store);
    this.sidebar = new Sidebar(sidebar, this.store);
  }

  render() {
    this.header.render();
    this.table.render();
    this.chart.render();
    this.sidebar.render();
    this.map.init();
    this.footer.render();
  }
}
