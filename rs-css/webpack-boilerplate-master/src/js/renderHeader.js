import renderElement from './renderElement';

export default function renderHeader(rootElement) {
  const header = renderElement('header', ['header'], rootElement);
  const message = "If the CSS Editor won't load, please refresh page";

  renderElement('h1', ['header__logo'], header, 'CSS Dinner');
  renderElement('span', ['header__message'], header, message);
}
