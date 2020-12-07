import renderElement from './renderElement';

export default class Header {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  initialize() {
    const footer = renderElement('footer', ['footer'], this.rootElement);

    renderElement('span', ['footer__author'], footer, 'Made by Kovnev Vasily 2020');

    const footerAuthorLink = renderElement('a', ['footer__author-link'], footer, 'Git Hub');
    footerAuthorLink.href = 'https://github.com/KaguraDun';
    footerAuthorLink.target = '_blank';

    const footerLogoLink = renderElement('a', ['footer__logo-link'], footer);
    footerLogoLink.href = 'https://rs.school/js/';
    footerLogoLink.target = '_blank';

    const footerLogo = renderElement('img', ['footer__logo-img'], footerLogoLink);
    footerLogo.src = './assets/icons/rs_school_js.svg';
    footerLogo.width = '100';
  }
}
