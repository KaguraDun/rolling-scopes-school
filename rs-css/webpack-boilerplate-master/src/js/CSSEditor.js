import renderElement from './renderElement';
import { EVENT_NAME, ChangeLevelEvent } from './events/ChangeLevelEvent';
import { CompleteGameEvent } from './events/CompleteGameEvent';

export default class CSSEditor {
  constructor(rootElement, eventEmitter, currentLevel, levels) {
    this.currentLevel = currentLevel;
    this.levels = levels;
    this.rootElement = rootElement;
    this.input = null;
    this.eventEmitter = eventEmitter;
    this.trySelector = this.trySelector.bind(this);
    this.keydownWatch = this.keydownWatch.bind(this);
  }

  createinput(parentElement) {
    this.input = renderElement('input', ['game-editor__input'], parentElement);
    this.input.placeholder = 'Type in a CSS Selector';
    this.input.addEventListener('keydown', this.keydownWatch);
    this.getCurrentLevel = this.getCurrentLevel.bind(this);
  }

  keydownWatch(event) {
    if (event.key === 'Enter') {
      this.trySelector();
    }
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'CSS Editor');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    const button = renderElement('button', ['button', 'button__enter'], gameEditorLayout, 'ENTER');

    this.createinput(gameEditorLayout);

    button.addEventListener('click', this.trySelector);

    this.eventEmitter.addEvent(EVENT_NAME, this.getCurrentLevel);
  }

  getCurrentLevel({ detail }) {
    this.currentLevel = detail.selectedLevel;
    console.log('in index', this.currentLevel);
  }

  trySelector() {
    if (!this.input.value) return;

    const CLASS__SELECTED = '--selected';
    // Подумать как искать только на table
    const gameTableLayout = document.querySelector('.game-table__layout');
    const elementsCountForWin = gameTableLayout.querySelectorAll(`.${CLASS__SELECTED}`).length;
    const selectedElements = gameTableLayout.querySelectorAll(this.input.value);
    const selectedElementsArr = [];

    if (selectedElements.length === 0) {
      this.wrongSelectorHighlight(gameTableLayout);
      return;
    }

    selectedElements.forEach((element) => {
      if (element.classList.contains(CLASS__SELECTED)) {
        selectedElementsArr.push(element);
      } else {
        this.wrongSelectorHighlight(element);
      }
    });

    if (selectedElementsArr.length === elementsCountForWin) {
      this.levels[this.currentLevel].complete = true;

      const nextLevel = this.selectNextLevel();

      this.rightSelectorHighlight(selectedElementsArr);
      console.log(nextLevel)
      if (nextLevel === undefined) {
        console.log('1123');
        setTimeout(() => this.eventEmitter.emit(new CompleteGameEvent(), 1000));
        return;
      }

      setTimeout(() => this.eventEmitter.emit(new ChangeLevelEvent(nextLevel)), 1000);
    }
  }

  selectNextLevel() {
    for (let i = 0; i < this.levels.length; i += 1) {
      if (this.levels[i].complete === false && this.levels[i].completeWithHelp === false) {
        return i;
      }
    }
  }

  rightSelectorHighlight(elements) {
    const CLASS_SUCCES = '--succes';

    elements.forEach((element) => {
      element.classList.add(CLASS_SUCCES);
    });
  }

  wrongSelectorHighlight(element) {
    const CLASS_WRONG = '--wrong';

    element.classList.add(CLASS_WRONG);
    setTimeout(() => element.classList.remove(CLASS_WRONG), 1000);
  }
}
