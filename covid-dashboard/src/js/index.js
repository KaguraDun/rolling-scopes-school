import '../styles/index.scss';
import Page from './components/Page';
import Store from './Store';

// import EventEmitter from './EventEmitter';
function createPageHtml() {
  const pageHtml = `<header class="header"></header>
                <div class="main">
                    <sidebar class="sidebar"></sidebar>
                      <div class="map" id="mapId"></div>
                      <div class="statistic__wrapper">
                          <div class="table">
                              <div class="table__statistic"></div>
                              <div class="table__news"></div>
                          </div>
                          <div class="chart"></div>
                      </div>
                </div>
                <footer class="footer"></footer>`;
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = pageHtml;
  document.body.appendChild(page);
}

function startApp() {
  createPageHtml();
  const store = new Store();
  store.init();
  const page = new Page(store);
  page.createChildren();
  page.render();
}

startApp();
