import renderElement from './renderElement';
import * as CodeMirror from './codemirror-js/lib/codemirror';
import './codemirror-js/addon/display/placeholder';
import './codemirror-js/mode/css/css';
import './codemirror-js/lib/codemirror.css';
import './codemirror-js/theme/dracula.css';

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
    this.clearInput = this.clearInput.bind(this);
    this.keydownWatch = this.keydownWatch.bind(this);
  }

  createinput(parentElement) {
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
      }
    });

    // https://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield
    this.input.on('beforeChange', (instance, change) => {
      const newText = change.text.join('').replace(/\n/g, '');
      change.update(change.from, change.to, [newText]);
      return true;
    });

    this.eventEmitter.addEvent(EVENT_NAME, this.clearInput);
  }

  clearInput() {
    this.input.setValue('');
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
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    const button = renderElement('button', ['button', 'button__enter'], gameEditorLayout, 'ENTER');

    this.createinput(gameEditorLayout);

    button.addEventListener('click', this.trySelector);

    this.eventEmitter.addEvent(EVENT_NAME, this.getCurrentLevel);
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
      this.wrongSelectorHighlight(gameTableLayout);
      return;
    }

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

      if (nextLevel === undefined) {
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
