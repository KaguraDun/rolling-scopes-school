import renderElement from './renderElement';

export default class CSSEditor {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  createTextArea(parentElement) {
    renderElement('div', ['game-editor__lines'], parentElement, '1');
    const gameEditorInput = renderElement('textarea', ['game-editor__input'], parentElement);
    gameEditorInput.placeholder = 'Type in a CSS Selector';
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'CSS Editor');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'style.css');
    renderElement('button', ['button', 'button__enter'], gameEditorLayout, 'ENTER');

    this.createTextArea(gameEditorLayout);
  }
}
