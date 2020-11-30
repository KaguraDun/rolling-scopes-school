import renderElement from './renderElement';
import { ChangeLevelEvent } from './events/ChangeLevelEvent';

export default class LevelList {
  constructor(rootElement, levels, eventEmitter) {
    this.rootElement = rootElement;
    this.levels = levels;
    this.eventEmitter = eventEmitter;
    this.onLevelSelect = this.onLevelSelect.bind(this);
  }

  initialize() {
    const list = renderElement('ul', ['level-list'], this.rootElement);

    this.levels.forEach((element, index) => {
      const listItem = renderElement('li', ['level-list__item'], list);
      const listItemLink = renderElement('a', ['level-list__item-link'], listItem, element.name);
      listItemLink.href = '#';
      listItemLink.id = index;
      //Сделать делегирование всему списку а не каждому элементу
      listItemLink.addEventListener('click', this.onLevelSelect);
    });
  }

  onLevelSelect(event) {
    this.eventEmitter.emit(new ChangeLevelEvent(event.target.id));
  }
}
