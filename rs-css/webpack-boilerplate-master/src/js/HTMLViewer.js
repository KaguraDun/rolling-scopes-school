import renderElement from './renderElement';
import { EVENT_NAME } from './events/ChangeLevelEvent';

// Проверить мб стоит наследовать от CSS Editor
export default class HTMLViewer {
  constructor(rootElement, eventEmitter) {
    this.rootElement = rootElement;
    this.eventEmitter = eventEmitter;
    this.gameHTMLViewer = null;
    this.getHTMLCode = this.getHTMLCode.bind(this);
  }

  renderTextArea(parentElement, gameEditorSize) {
    const gameEditorLines = renderElement('div', ['game-editor__lines'], parentElement);

    for (let i = 0; i < gameEditorSize; i += 1) {
      renderElement('div', ['game-editor__line-num'], gameEditorLines, i + 1);
      renderElement('br', [], gameEditorLines);
    }

    this.gameHTMLViewer = renderElement('textarea', ['game-editor__viewer'], parentElement);

    this.eventEmitter.addEvent(EVENT_NAME, this.getHTMLCode);
  }

  initialize() {
    const gameEditorSize = 9;
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'HTMLViewer');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'index.html');

    this.renderTextArea(gameEditorLayout, gameEditorSize);
  }

  getHTMLCode() {
    // Придумать как получить table Layout по нормальному
    const tableLayout = document.querySelector('.game-table')
    this.gameHTMLViewer.value = tableLayout.innerHTML;
  }
}
