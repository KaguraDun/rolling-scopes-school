import createElement from './renderElement';

export default class Header {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  initialize() {
    const header = createElement('header', ['header'], this.rootElement);
    createElement('h1', ['header__logo'], header, 'CSS Dinner');
  }
}
