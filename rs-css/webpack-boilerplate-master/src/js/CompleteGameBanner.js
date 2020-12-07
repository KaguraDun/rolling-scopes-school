import renderElement from './renderElement';
import { EVENT_NAME as CompleteGame } from './events/CompleteGameEvent';
import { NewGameEvent } from './events/NewGameEvent';

export default class CompleteGameBanner {
  constructor(rootElement, eventEmitter) {
    this.rootElement = rootElement;
    this.eventEmitter = eventEmitter;
    this.render = this.render.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  initialize() {
    this.eventEmitter.addEvent(CompleteGame, this.render);
  }

  render() {
    console.log('123');
    const message = 'Congrats you have finished the game and become an expert in CSS selectors!';

    const banner = renderElement('div', ['complete-game-banner'], this.rootElement);
    renderElement('h3', ['complete-game-banner__message'], banner, message);

    const newGameButton = renderElement(
      'button',
      ['button', 'button__new-game','--button-big'],
      banner,
      'New Game',
    );
    newGameButton.addEventListener('click', this.newGame);
  }

  newGame() {
    this.eventEmitter.emit(new NewGameEvent());
  }
}
