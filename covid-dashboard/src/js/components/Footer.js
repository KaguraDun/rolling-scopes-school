import renderElement from '../helpers/renderElement';

const AUTHORS = [
  {
    name: 'Anastasiya Zavrazhneva',
    gitHubLink: 'https://github.com/zavrazhneva',
  },
  {
    name: 'Ilya Barachenia',
    gitHubLink: 'https://github.com/mykamapolice',
  },
  {
    name: 'Iuliia Mazaeva',
    gitHubLink: 'https://github.com/juliememe',
  },
  {
    name: 'Vasily Kovnev',
    gitHubLink: 'https://github.com/kaguradun',
  },
];

export default class Footer {
  constructor(footer) {
    this.footer = footer;
  }

  render() {
    renderElement('span', ['footer__year'], this.footer, '2020');

    AUTHORS.forEach((author) => {
      const footerAuthorLink = renderElement(
        'a',
        ['footer__author-link'],
        this.footer,
        author.name,
      );
      footerAuthorLink.href = author.gitHubLink;
      footerAuthorLink.target = '_blank';
    });

    const footerLogoLink = renderElement('a', ['footer__logo-link'], this.footer);
    footerLogoLink.href = 'https://rs.school/js/';
    footerLogoLink.target = '_blank';

    const footerLogo = renderElement('img', ['footer__logo-img'], footerLogoLink);
    footerLogo.src = './assets/icons/rs_school_js.svg';
    footerLogo.width = '100';
  }
}
