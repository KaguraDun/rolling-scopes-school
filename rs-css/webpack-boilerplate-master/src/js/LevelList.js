import createElement from './createElement';

export default class LevelList {
  constructor(rootElement, levels) {
    this.rootElement = rootElement;
    this.levels = levels;
  }

  initialize() {
    const list = createElement('ul', ['level-list'], this.rootElement);

    this.levels.forEach((element) => {
      const listItem = createElement('li', ['level-list__item'], list);
      const listItemLink = createElement('a', ['level-list__item-link'], listItem, element.name);
      listItemLink.href = '#';
    });
  }
}
