import '../styles/index.scss';

import renderElement from './renderElement';
import renderFooter from './renderFooter';
import gameLevels from './gameLevels';

import renderHeader from './renderHeader';
import GameTable from './GameTable';
import CSSEditor from './CSSEditor';
import HTMLViewer from './HTMLViewer';
import LevelList from './LevelList';
import EventEmitter from './EventEmitter';
import CompleteGameBanner from './CompleteGameBanner';

import { EVENT_NAME as ChangeLevel, ChangeLevelEvent } from './events/ChangeLevelEvent';
import { EVENT_NAME as NewGame } from './events/NewGameEvent';

class Game {
  constructor() {
    this.currentLevel = 0;
    this.levels = gameLevels;
    this.getCurrentLevel = this.getCurrentLevel.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  initialize() {
    const eventEmitter = new EventEmitter();

    const pageWrapper = renderElement('div', ['page__wrapper'], document.body);
    const pageLeftColumn = renderElement('div', ['page__left-col'], pageWrapper);
    const pageRightColumn = renderElement('div', ['page__right-col'], pageWrapper);

    const gameTable = new GameTable(pageLeftColumn, this.currentLevel, this.levels, eventEmitter);
    const cssEditor = new CSSEditor(pageLeftColumn, eventEmitter, this.currentLevel, this.levels);
    const htmlViewer = new HTMLViewer(pageLeftColumn, this.levels, eventEmitter);
    const levelList = new LevelList(pageRightColumn, this.levels, this.currentLevel, eventEmitter);
    const completeGameBanner = new CompleteGameBanner(pageWrapper, eventEmitter);

    renderHeader(pageLeftColumn);

    gameTable.initialize();
    cssEditor.initialize();
    htmlViewer.initialize();
    levelList.initialize();

    renderFooter(pageLeftColumn);

    completeGameBanner.initialize();

    eventEmitter.emit(new ChangeLevelEvent(0));
    eventEmitter.addEvent(NewGame, this.newGame);
    eventEmitter.addEvent(ChangeLevel, this.getCurrentLevel);
  }

  newGame() {
    document.body.innerHTML = '';

    this.levels.forEach((element) => {
      element.complete = false;
      element.completeWithHelp = false;
    });

    this.initialize();
  }

  getCurrentLevel({ detail }) {
    this.currentLevel = detail.selectedLevel;
  }
}

const game = new Game();

game.initialize();
