import '../styles/index.scss';

import createElement from './renderElement';
import gameLevels from './gameLevels';

import Header from './Header';
import GameTable from './GameTable';
import CSSEditor from './CSSEditor';
import HTMLViewer from './HTMLViewer';
import LevelList from './LevelList';
import Footer from './Footer';
import EventEmitter from './EventEmitter';

class Game {
  constructor(levels) {
    this.currentLevel = 0;
    this.levels = levels;
    this.levelsCount = this.levels.length;
    this.tableElement = null;
  }

  initialize() {
    const eventEmitter = new EventEmitter();

    const pageWrapper = createElement('div', ['page__wrapper'], document.body);
    const pageLeftColumn = createElement('div', ['page__left-col'], pageWrapper);
    const pageRightColumn = createElement('div', ['page__right-col'], pageWrapper);

    const header = new Header(pageLeftColumn);
    const gameTable = new GameTable(pageLeftColumn, this.currentLevel, this.levels, eventEmitter);
    const cssEditor = new CSSEditor(pageLeftColumn);
    const htmlViewer = new HTMLViewer(pageLeftColumn, eventEmitter);
    const levelList = new LevelList(pageRightColumn, this.levels, eventEmitter);
    const footer = new Footer(pageLeftColumn);

    header.initialize();
    gameTable.initialize();
    cssEditor.initialize();
    htmlViewer.initialize();
    levelList.initialize();
    footer.initialize();
  }
}

const game = new Game(gameLevels);
game.initialize();
