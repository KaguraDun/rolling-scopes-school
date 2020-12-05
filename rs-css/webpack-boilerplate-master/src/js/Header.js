import renderElement from './renderElement';

export default class Header {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  initialize() {
    const header = renderElement('header', ['header'], this.rootElement);

    renderElement('h1', ['header__logo'], header, 'CSS Dinner');
  }
}
