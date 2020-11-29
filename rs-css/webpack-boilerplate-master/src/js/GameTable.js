import createElement from './createElement';

export default class GameTable {
  constructor(rootElement, currentLevel, levels) {
    this.rootElement = rootElement;
    this.currentLevel = currentLevel;
    this.levels = levels;
  }

  initialize() {
    const gameTable = createElement('div', ['game-table'], this.rootElement);
    const gameTableLayout = createElement('div', ['game-table__layout'], gameTable);

    this.render(gameTableLayout);
  }

  render(parentElement) {
    const levelElements = this.levels[this.currentLevel].elements;
    levelElements.forEach((element) => {
      createElement(element, [element], parentElement);
    });
  }
}
