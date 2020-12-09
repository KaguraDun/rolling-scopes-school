import renderElement from './renderElement';

import { EVENT_NAME as ChangeLevel, ChangeLevelEvent } from './events/ChangeLevelEvent';
import { NewGameEvent } from './events/NewGameEvent';

function highlightCurrentLevel(element) {
  element.classList.add('--highlight-current-level');
}

export default class LevelList {
  constructor(rootElement, levels, currentLevel, eventEmitter) {
    this.rootElement = rootElement;
    this.levels = levels;
    this.currentLevel = currentLevel;
    this.levelsList = null;
    this.eventEmitter = eventEmitter;
    this.onLevelSelect = this.onLevelSelect.bind(this);
    this.render = this.render.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  initialize() {
    this.levelsList = renderElement('ul', ['level-list'], this.rootElement);
    this.levelsList.addEventListener('click', this.onLevelSelect);

    this.eventEmitter.addEvent(ChangeLevel, this.render);
    this.eventEmitter.emit(new ChangeLevelEvent(this.currentLevel));

    const newGameButton = renderElement(
      'button',
      ['button', 'button__new-game', '.--button-normal'],
      this.rootElement,
      'New Game',
    );

    newGameButton.addEventListener('click', this.newGame);
  }

  render({ detail }) {
    this.levelsList.innerHTML = '';
    this.currentLevel = detail.selectedLevel;

    this.levels.forEach((element, index) => {
      const listItem = renderElement('li', ['level-list__item'], this.levelsList);
      const listItemLink = renderElement('a', ['level-list__item-link'], listItem);
      const completeIcon = renderElement('span', ['level-list__complete-icon'], listItemLink);

      if (element.complete) completeIcon.textContent = '✔';
      if (element.completeWithHelp) completeIcon.textContent = '?';

      renderElement('span', ['level-list__item-number'], listItemLink, `${index + 1}:`);
      renderElement('span', ['level-list__item-name'], listItemLink, `${element.name}`);

      listItemLink.href = '#';
      listItemLink.dataset.levelNumber = index;
    });

    highlightCurrentLevel(this.levelsList.children[this.currentLevel]);
  }

  newGame() {
    this.eventEmitter.emit(new NewGameEvent());
  }

  onLevelSelect({ target }) {
    const levelNumber = target.dataset.levelNumber || target.parentNode.dataset.levelNumber;

    if (!levelNumber) return;

    this.currentLevel = levelNumber;
    this.eventEmitter.emit(new ChangeLevelEvent(levelNumber));
  }
}
