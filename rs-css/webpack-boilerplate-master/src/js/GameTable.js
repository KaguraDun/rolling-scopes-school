import { EVENT_NAME as ChangeLevelEvent } from './events/ChangeLevelEvent';
import { HighlightElementEvent } from './events/HighlightElementEvent';
import renderElement from './renderElement';

export default class GameTable {
  constructor(rootElement, currentLevel, levels, eventEmitter) {
    this.rootElement = rootElement;
    this.currentLevel = currentLevel;
    this.levels = levels;
    this.levelElements = null;
    this.gameTableLayout = null;
    this.render = this.render.bind(this);
    this.highlightElement = this.highlightElement.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.eventEmitter = eventEmitter;
    this.showHTMLCodeElement = null;
  }

  initialize() {
    const gameTable = renderElement('div', ['game-table'], this.rootElement);

    this.gameTableLayout = renderElement('div', ['game-table__layout'], gameTable);

    this.eventEmitter.addEvent(ChangeLevelEvent, this.render);

    this.gameTableLayout.addEventListener('mouseover', this.highlightElement);

    this.showHTMLCodeElement = renderElement('div', ['element-HTML-code'], gameTable);
    this.showHTMLCodeElement.hidden = true;
  }

  render({ detail }) {
    const selectedLevel = Number(detail.selectedLevel);
    this.levelElements = this.levels[selectedLevel].markup;

    this.gameTableLayout.innerHTML = this.levelElements.join('');
  }

  highlightElement(event) {
    if (event.target.tagName === 'DIV') return;

    const topOffset = 50;
    const elementHTML = this.formatElementHTML(event.target);
    const elementPosition = event.target.getBoundingClientRect();
    const elementNumberInList = this.levelElements.indexOf(event.target);
    console.log(this.levelElements, event.target, elementNumberInList);

    this.showHTMLCodeElement.hidden = false;
    this.showHTMLCodeElement.textContent = elementHTML;
    this.showHTMLCodeElement.style.top = `${elementPosition.top - topOffset}px`;
    this.showHTMLCodeElement.style.left = `${elementPosition.left}px`;

    event.target.classList.add('--highlight-element');
    event.target.addEventListener('mouseout', this.removeHighlight);

    this.eventEmitter.emit(new HighlightElementEvent(elementNumberInList));
  }

  removeHighlight(event) {
    this.showHTMLCodeElement.hidden = true;
    event.target.classList.remove('--highlight-element');
  }

  formatElementHTML(element) {
    // тут код дублируется с html viewer!
    const html = element.outerHTML.replace(element.innerHTML, '');
    return html.replace(' class="--selected"', '').replace(' --selected', '');
  }
}
