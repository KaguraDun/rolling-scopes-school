import renderElement from './renderElement';

export default class Header {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  initialize() {
    const footer = renderElement('footer', ['footer'], this.rootElement);
    renderElement('span', ['footer__author'], footer, 'Made by Kovnev Vasily:');
    const footerAuthorLink = renderElement('a', ['footer__author-link'], footer, 'Git Hub');
    footerAuthorLink.href = 'https://github.com/KaguraDun';
    footerAuthorLink.target = '_blank';

    renderElement('span', ['footer__year'], footer, '2020');

  }
}

//   <div class="footer__logo">
//     <a href="https://rs.school/js/" class="footer__logo-link" target="_blank"><img
//         src="/assets/icons/rs_school_js.svg" alt="" class="footer__logo-image" width="100px"></a>
//   </div>
