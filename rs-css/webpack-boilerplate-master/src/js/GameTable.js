import { EVENT_NAME } from './events/ChangeLevelEvent';
import renderElement from './renderElement';

export default class GameTable {
  constructor(rootElement, currentLevel, levels, eventEmitter) {
    this.rootElement = rootElement;
    this.currentLevel = currentLevel;
    this.levels = levels;
    this.gameTableLayout = null;
    this.render = this.render.bind(this);
    this.eventEmitter = eventEmitter;
  }

  initialize() {
    const gameTable = renderElement('div', ['game-table'], this.rootElement);
    this.gameTableLayout = renderElement('div', ['game-table__layout'], gameTable);

    this.eventEmitter.addEvent(EVENT_NAME, this.render);
  }

  render({ detail }) {
    const selectedLevel = Number(detail.selectedLevel);
    const levelElements = this.levels[selectedLevel];

    this.gameTableLayout.innerHTML = levelElements.markup;
  }
}
