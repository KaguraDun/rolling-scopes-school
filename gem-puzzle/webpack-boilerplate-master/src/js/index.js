import '../styles/index.scss';
import {
  newGame,
  createElement,
  createBestResultsButton,
  createNewGameButton,
  createGameSizeSelector,
  createEnableSoundButton,
  createAutoCompleteButton,
} from './modules/layout';

const game = {
  properties: {
    fieldSize: 4,
    timer: 0,
    numberOfMoves: 0,
    enableSound: false,
  },

  elements: {
    gameField: null,
    completeMessageTextEl: null,
    timer: null,
    timerTextEl: null,
    numberOfMovesTextEl: null,
    currentDroppable: null,
  },
};

const gameWrapper = createElement('div', 'wrapper', document.body);
const gameContainer = createElement('div', 'game', gameWrapper);
const gameButtonsWrapper = createElement('div', 'game__buttons-wrapper', gameContainer);
const gameHeader = createElement('div', 'game__header', gameContainer);

createBestResultsButton(gameButtonsWrapper);
createNewGameButton(gameButtonsWrapper, game);
createGameSizeSelector(gameButtonsWrapper);
createAutoCompleteButton(gameButtonsWrapper, game);
createEnableSoundButton(gameButtonsWrapper, game);

game.elements.timerTextEl = createElement('span', 'game__time', gameHeader, '00:00');
game.elements.numberOfMovesTextEl = createElement('span', 'game__number-of-moves', gameHeader, '0');
game.elements.gameField = createElement('div', 'game__field', gameContainer);

newGame(game);
