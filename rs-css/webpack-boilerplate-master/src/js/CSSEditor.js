import renderElement from './renderElement';
import Prism from './prism-highlight/prism';

export default class CSSEditor {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  createTextArea(parentElement) {
    const gameEditorInput = renderElement('textarea', ['game-editor__input'], parentElement);
    gameEditorInput.placeholder = 'Type in a CSS Selector';

    gameEditorInput.addEventListener('change', this.highlightCode);
  }

  highlightCode({ target }) {
    console.log(target);
    Prism.highlightElement(target);
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
