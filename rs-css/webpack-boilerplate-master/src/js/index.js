import '../styles/index.scss';

import createElement from './createElement';
import gameLevels from './gameLevels';

import Header from './Header';
import GameTable from './GameTable';
import CSSEditor from './CSSEditor';
import LevelList from './LevelList';
import Footer from './Footer';

class Game {
  constructor(levels) {
    this.currentLevel = 0;
    this.levels = levels;
    this.levelsCount = this.levels.length;
  }

  initialize() {
    const pageWrapper = createElement('div', ['page__wrapper'], document.body);
    const pageLeftColumn = createElement('div', ['page__left-col'], pageWrapper);
    const pageRightColumn = createElement('div', ['page__right-col'], pageWrapper);

    const header = new Header(pageLeftColumn);
    const gameTable = new GameTable(pageLeftColumn, this.currentLevel, this.levels);
    const cssEditor = new CSSEditor(pageLeftColumn);
    //   const htmlViewer = new HTMLViewer(leftColumn);
    const levelList = new LevelList(pageRightColumn, this.levels);
    const footer = new Footer(pageLeftColumn);

    header.initialize();
    gameTable.initialize();
    cssEditor.initialize();
    levelList.initialize();
    footer.initialize();
  }
}

const game = new Game(gameLevels);

game.initialize();
