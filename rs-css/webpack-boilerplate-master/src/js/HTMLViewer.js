import renderElement from './renderElement';
import { EVENT_NAME } from './events/ChangeLevelEvent';
import Prism from './prism-highlight/prism';

// Проверить мб стоит наследовать от CSS Editor
export default class HTMLViewer {
  constructor(rootElement, eventEmitter) {
    this.rootElement = rootElement;
    this.eventEmitter = eventEmitter;
    this.gameHTMLViewer = null;
    this.getHTMLCode = this.getHTMLCode.bind(this);
  }

  renderCodeBlock(parentElement) {
    const gameHTML = renderElement('div', ['game-editor__viewer'], parentElement);
    const preElement = renderElement('pre', ['line-numbers'], gameHTML);

    this.gameHTMLViewer = renderElement('code', ['language-markup'], preElement);

    this.eventEmitter.addEvent(EVENT_NAME, this.getHTMLCode);
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'HTMLViewer');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'index.html');

    this.renderCodeBlock(gameEditorLayout);
  }

  getHTMLCode() {
    // Придумать как получать game table без querry selector
    const gameTable = document.querySelector('.game-table');
    const gameTableHTML = gameTable.innerHTML
      .replace(' class="--selected"', '')
      .replace(' --selected', '');

    this.gameHTMLViewer.textContent = this.format(gameTableHTML);
    Prism.highlightElement(this.gameHTMLViewer);
  }

  // https://stackoverflow.com/questions/3913355/how-to-format-tidy-beautify-in-javascript
  format(html) {
    const tab = '\t';
    let result = '';
    let indent = '';

    html.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }

      result += `${indent}<${element}>\r\n`;

      if (element.match(/^<?\w[^>]*[^\/]$/)) {
        indent += tab;
      }
    });

    return result.substring(1, result.length - 3);
  }
}
