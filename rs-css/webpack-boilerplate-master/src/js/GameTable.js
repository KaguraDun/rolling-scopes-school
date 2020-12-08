import hljs from 'highlight.js';
import renderElement from './renderElement';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

import { EVENT_NAME as ChangeLevel } from './events/ChangeLevelEvent';

function formatElementHTML(element) {
  const html = element.outerHTML.replace(element.innerHTML, '');
  return html.replace(' class="--selected"', '').replace(' --selected', '');
}

export default class GameTable {
  constructor(rootElement, currentLevel, levels, eventEmitter) {
    this.rootElement = rootElement;
    this.currentLevel = currentLevel;
    this.levels = levels;
    this.levelElements = null;
    this.gameTableLayout = null;
    this.levelDescription = null;
    this.render = this.render.bind(this);
    this.highlightElement = this.highlightElement.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.eventEmitter = eventEmitter;
    this.showHTMLCodeElement = null;
  }

  initialize() {
    const gameTable = renderElement('div', ['game-table'], this.rootElement);
    this.levelDescription = renderElement('h3', ['game-table__description'], gameTable);
    this.gameTableLayout = renderElement('div', ['game-table__layout'], gameTable);
    this.gameTableLayout.addEventListener('mouseover', this.highlightElement);

    this.eventEmitter.addEvent(ChangeLevel, this.render);

    this.showHTMLCodeElement = renderElement('div', ['highlight-html-element'], gameTable);
    this.showHTMLCodeElement.style.display = 'none';
  }

  render({ detail }) {
    const selectedLevel = Number(detail.selectedLevel);

    this.levelElements = this.levels[selectedLevel].markup;

    this.gameTableLayout.innerHTML = this.levelElements.join('');
    this.levelDescription.innerHTML = this.levels[selectedLevel].description;
  }

  highlightElement(event) {
    if (event.target.tagName === 'DIV') return;

    const topOffset = 50;
    const elementHTML = formatElementHTML(event.target);
    const elementPosition = event.target.getBoundingClientRect();

    this.showHTMLCodeElement.style.display = 'block';
    this.showHTMLCodeElement.textContent = elementHTML;
    this.showHTMLCodeElement.style.top = `${elementPosition.top - topOffset}px`;
    this.showHTMLCodeElement.style.left = `${elementPosition.left}px`;

    hljs.highlightBlock(this.showHTMLCodeElement);
    event.target.classList.add('--highlight-element');
    event.target.addEventListener('mouseout', this.removeHighlight);
  }

  removeHighlight(event) {
    this.showHTMLCodeElement.style.display = 'none';
    event.target.classList.remove('--highlight-element');
  }
}
