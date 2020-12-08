import renderElement from './renderElement';

export default class Header {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  initialize() {
    const header = renderElement('header', ['header'], this.rootElement);

    renderElement('h1', ['header__logo'], header, 'CSS Dinner');
    renderElement(
      'span',
      ['header__message'],
      header,
      "!If the CSS editor won't load, please refresh page until it loads."
        + '\n Or use Firefox, i am trying to fix this issue',
    );
  }
}
