import renderElement from './renderElement';

import { ChangeLevelEvent } from './events/ChangeLevelEvent';

export default class CSSEditor {
  constructor(rootElement, eventEmitter) {
    this.rootElement = rootElement;
    this.textArea = null;
    this.eventEmitter = eventEmitter;
    this.trySelector = this.trySelector.bind(this);
  }

  createTextArea(parentElement) {
    this.textArea = renderElement('textarea', ['game-editor__input'], parentElement);
    this.textArea.placeholder = 'Type in a CSS Selector';
    this.textArea.addEventListener('change', this.highlightCode);
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'CSS Editor');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    const button = renderElement('button', ['button', 'button__enter'], gameEditorLayout, 'ENTER');

    this.createTextArea(gameEditorLayout);

    button.addEventListener('click', this.trySelector);
  }

  trySelector() {
    if (!this.textArea.value) return;

    const CLASS__SELECTED = '--selected';
    // Подумать как искать только на table
    const gameTableLayout = document.querySelector('.game-table__layout');
    const elementsCountForWin = document.querySelectorAll(`.${CLASS__SELECTED}`).length;
    const selectedElements = document.querySelectorAll(this.textArea.value);
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
      this.rightSelectorHighlight(selectedElementsArr);
      // Получить текущий уровень и перейти на уровень +1;
      // Добавить проверку на конец игры
      setTimeout(() => this.eventEmitter.emit(new ChangeLevelEvent(2)), 1000);
      // переходим на следующий уровень
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
