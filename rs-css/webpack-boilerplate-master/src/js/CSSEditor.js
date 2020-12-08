import CodeMirror from 'codemirror/lib/codemirror';
import renderElement from './renderElement';

import 'codemirror/addon/display/placeholder';
import 'codemirror/mode/css/css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

import { EVENT_NAME, ChangeLevelEvent } from './events/ChangeLevelEvent';
import { CompleteGameEvent } from './events/CompleteGameEvent';

function rightSelectorHighlight(elements) {
  const CLASS_SUCCES = '--succes';

  elements.forEach((element) => {
    element.classList.add(CLASS_SUCCES);
  });
}

function wrongSelectorHighlight(element) {
  const CLASS_WRONG = '--wrong';

  element.classList.add(CLASS_WRONG);
  setTimeout(() => element.classList.remove(CLASS_WRONG), 1000);
}

export default class CSSEditor {
  constructor(rootElement, eventEmitter, currentLevel, levels) {
    this.currentLevel = currentLevel;
    this.levels = levels;
    this.rootElement = rootElement;
    this.input = null;
    this.eventEmitter = eventEmitter;
    this.trySelector = this.trySelector.bind(this);
    this.enterCorrectSelector = this.enterCorrectSelector.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.keydownWatch = this.keydownWatch.bind(this);
  }

  createInput(parentElement) {
    const textArea = renderElement('textarea', ['game-editor__input'], parentElement);
    this.getCurrentLevel = this.getCurrentLevel.bind(this);

    this.input = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      placeholder: 'Type in a CSS Selector',
      mode: 'text/css',
      theme: 'dracula',
    });

    this.input.setSize('100%', '50px');

    // https://github.com/scniro/react-codemirror2/issues/55
    this.input.on('keyHandled', (cm, name, e) => {
      if (name === 'Enter') {
        e.preventDefault();
        this.trySelector();
        this.input.refresh();
      }
    });

    // https://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield
    this.input.on('beforeChange', (instance, change) => {
      const newText = change.text.join('').replace(/\n/g, '');
      change.update(change.from, change.to, [newText]);
      this.input.refresh();
      return true;
    });

    this.eventEmitter.addEvent(EVENT_NAME, this.clearInput);

    setTimeout(() => {
      this.input.refresh();
    }, 10);
  }

  clearInput() {
    this.input.setValue('');
    this.input.refresh();
  }

  keydownWatch(name) {
    if (name === 'Enter') {
      this.trySelector();
    }
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'CSS Editor');
    const buttonHelp = renderElement('button', ['button', 'button__help'], gameEditorInfo, '?');

    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    const buttonEnter = renderElement(
      'button',
      ['button', 'button__enter'],
      gameEditorLayout,
      'ENTER',
    );

    this.createInput(gameEditorLayout);

    buttonEnter.addEventListener('click', this.trySelector);
    buttonHelp.addEventListener('click', this.enterCorrectSelector);

    this.eventEmitter.addEvent(EVENT_NAME, this.getCurrentLevel);
  }

  enterCorrectSelector() {
    const { correctSelector } = this.levels[this.currentLevel];

    for (let i = 0; i <= correctSelector.length; i += 1) {
      setTimeout(() => {
        this.input.setValue(correctSelector.slice(0, i));
        this.input.refresh();
      }, i * 150);
    }

    this.levels[this.currentLevel].completeWithHelp = true;
  }

  getCurrentLevel({ detail }) {
    this.currentLevel = detail.selectedLevel;
  }

  trySelector() {
    const inputValue = this.input.getValue();

    if (!inputValue) return;

    const CLASS__SELECTED = '--selected';

    const gameTableLayout = document.querySelector('.game-table__layout');
    const elementsCountForWin = gameTableLayout.querySelectorAll(`.${CLASS__SELECTED}`).length;
    const selectedElementsArr = [];
    let selectedElements = null;

    try {
      selectedElements = gameTableLayout.querySelectorAll(inputValue);
    } catch {
      wrongSelectorHighlight(gameTableLayout);
      return;
    }

    if (selectedElements.length === 0) {
      wrongSelectorHighlight(gameTableLayout);
      return;
    }

    selectedElements.forEach((element) => {
      if (element.classList.contains(CLASS__SELECTED)) {
        selectedElementsArr.push(element);
      } else {
        wrongSelectorHighlight(element);
      }
    });

    if (
      selectedElementsArr.length === selectedElements.length
      && selectedElementsArr.length === elementsCountForWin
    ) {
      this.levels[this.currentLevel].complete = true;

      const nextLevel = this.selectNextLevel();

      rightSelectorHighlight(selectedElementsArr);

      if (nextLevel === undefined) {
        setTimeout(() => this.eventEmitter.emit(new CompleteGameEvent(), 1000));
        return;
      }

      setTimeout(() => this.eventEmitter.emit(new ChangeLevelEvent(nextLevel)), 1000);
    }
  }

  selectNextLevel() {
    let nextElementIndex;

    for (let i = 0; i < this.levels.length; i += 1) {
      if (this.levels[i].complete === false && this.levels[i].completeWithHelp === false) {
        nextElementIndex = i;
        break;
      }
    }

    return nextElementIndex;
  }
}
