import renderElement from './renderElement';
import hljs from './highlight-js/highlight.pack';

import { EVENT_NAME as ChangeLevelEvent } from './events/ChangeLevelEvent';
import { EVENT_NAME as HighlightElementEvent } from './events/HighlightElementEvent';

export default class HTMLViewer {
  constructor(rootElement, levels, eventEmitter) {
    this.rootElement = rootElement;
    this.eventEmitter = eventEmitter;
    this.levels = levels;
    this.levelElements = null;
    this.gameHTMLViewer = null;
    this.gameTableHTML = null;
    this.renderHTMLCode = this.renderHTMLCode.bind(this);
  }

  renderCodeBlock(parentElement) {
    const gameHTML = renderElement('div', ['game-editor__viewer'], parentElement);
    const preElement = renderElement('pre', ['line-numbers'], gameHTML);

    this.gameHTMLViewer = renderElement('code', ['language-html'], preElement);

    this.eventEmitter.addEvent(ChangeLevelEvent, this.renderHTMLCode);
  }

  initialize() {
    const gameEditor = renderElement('div', ['game-editor'], this.rootElement);
    const gameEditorInfo = renderElement('div', ['game-editor__info'], gameEditor);
    const gameEditorLayout = renderElement('div', ['game-editor__layout'], gameEditor);

    renderElement('span', ['game-editor__heading'], gameEditorInfo, 'HTMLViewer');
    renderElement('span', ['game-editor__filename'], gameEditorInfo, 'index.html');

    this.renderCodeBlock(gameEditorLayout);

    this.eventEmitter.addEvent(HighlightElementEvent, this.highlightElement);
  }

  renderHTMLCode({ detail }) {
    const selectedLevel = Number(detail.selectedLevel);
    const gameTable = renderElement('div', ['table'], this.gameHTMLViewer);

    this.levelElements = this.levels[selectedLevel].markup;

    const levelHTML = this.levelElements
      .join('')
      .replace(' class="--selected"', '')
      .replace(' --selected', '');

    gameTable.insertAdjacentHTML('afterbegin', levelHTML);

    this.gameHTMLViewer.textContent = this.format(gameTable.outerHTML);

    hljs.highlightBlock(this.gameHTMLViewer);
  }

  // https://stackoverflow.com/questions/3913355/how-to-format-tidy-beautify-in-javascript
  format(html) {
    const tab = '  ';
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
