import createElement from './createElement';

export default class CSSEditor {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  createTextArea(parentElement) {
    createElement('div', ['game-editor__line-num'], parentElement, '1');
    const gameEditorInput = createElement('textarea', ['game-editor__input'], parentElement);
    gameEditorInput.placeholder = 'Type in a CSS Selector';
  }

  initialize() {
    const gameEditor = createElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = createElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = createElement('div', ['game-editor__layout'], gameEditor);

    createElement('span', ['game-editor__heading'], gameEditorInfo, 'CSS Editor');
    createElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    createElement('button', ['button', 'button__enter'], gameEditorLayout, 'ENTER');

    this.createTextArea(gameEditorLayout);
  }
}
