import '../styles/index.scss';

const game = {
  properties: {
    fieldSize: 3,
    timer: 0,
    numberOfMoves: 0,
  },

  elements: {
    gameField: null,
    timerTextEl: null,
    numberOfMovesTextEl: null,
  },
};

function createElement(tagName, className, parentName, innerText) {
  const element = document.createElement(tagName);
  element.classList.add(className);

  if (innerText) element.textContent = innerText;

  parentName.append(element);

  return element;
}

function runGameTimer() {
  setInterval(() => {
    game.properties.timer += 1;
    let minutes = Math.floor(game.properties.timer / 60);
    let seconds = game.properties.timer - minutes * 60;
    game.elements.timerTextEl.textContent = `${minutes} : ${seconds}`;
  }, 1000);
}

function arrayShuffle(array) {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    let randomNumber = Math.floor(Math.random() * i + 1);
    let tempValue = array[i];

    array[i] = array[randomNumber];
    array[randomNumber] = tempValue;
  }
}

function solvabilityCheck(fieldArray) {
  let positionSum = 0;

  for (let i = 0; i < fieldArray.length; i += 1) {
    for (let j = i; j < fieldArray.length; j += 1) {
      if (fieldArray[i] > fieldArray[j]) {
        positionSum += 1;
      }
    }
  }

  return positionSum % 2 ? true : false;
}

function generateGameFieldArray() {
  let fieldSize = game.properties.fieldSize * game.properties.fieldSize;
  let gameFieldArray = [];
  let findSolution = false;

  for (let i = 1; i < fieldSize; i += 1) {
    gameFieldArray.push(i);
  }

  while (findSolution !== true) {
    arrayShuffle(gameFieldArray);
    if (solvabilityCheck(gameFieldArray)) findSolution = true;
  }

  return gameFieldArray;
}

function swapItems(element, emptyCell) {
  let elementPosition = element.dataset.position;
  let elementPrevSibling = element.previousSibling;
  let emptyCellPrevSibling = emptyCell.previousSibling;

  elementPrevSibling.after(emptyCell);
  emptyCellPrevSibling.after(element);

  element.dataset.position = emptyCell.dataset.position;
  emptyCell.dataset.position = elementPosition;
}

function checkIfGameSolved() {
  let rightPositionCounter = 0;

  for (let i = 1; i < game.elements.gameField.childNodes.length - 1; i += 1) {
    if (game.elements.gameField.childNodes[i].id == i) rightPositionCounter += 1;
  }

  //Учитываем пустой элемент в самом начале
  if (rightPositionCounter == game.elements.gameField.childNodes.length - 2) {
    const message = `Game solved in ${game.properties.numberOfMoves} moves`;
    const gameCompliteMessage = createElement('div', 'game__complete', document.body, message);
  }
  //Добавить всплывающее уведомление
}

function moveItem(e) {
  const elementPosition = Number(e.target.dataset.position);

  const adjacentElements = {
    up: document.querySelector(
      `.game__field-item[data-position="${elementPosition - game.properties.fieldSize}"]`,
    ),
    bottom: document.querySelector(
      `.game__field-item[data-position="${elementPosition + game.properties.fieldSize}"]`,
    ),
    left: document.querySelector(`.game__field-item[data-position="${elementPosition - 1}"]`),
    right: document.querySelector(`.game__field-item[data-position="${elementPosition + 1}"]`),
  };

  for (const key in adjacentElements) {
    if (adjacentElements[key] && adjacentElements[key].id === '0') {
      swapItems(e.target, adjacentElements[key]);
      game.properties.numberOfMoves += 1;
      game.elements.numberOfMovesTextEl.textContent = game.properties.numberOfMoves;
      checkIfGameSolved();
    }
  }
}

function generateGameField(fieldArray) {
  let fieldSize = game.properties.fieldSize * game.properties.fieldSize;

  //Добавим пустой div для того чтобы при выполнении функции swap у первой ячейки был предыдущий элемент
  createElement('div', 'game__field-item--null', game.elements.gameField);

  for (let i = 0; i <= fieldSize - 1; i += 1) {
    let gameFieldItem = '';

    if (i === fieldSize - 1) {
      gameFieldItem = createElement('div', 'game__field-item', game.elements.gameField, 0);
      gameFieldItem.id = 0;
    } else {
      gameFieldItem = createElement(
        'div',
        'game__field-item',
        game.elements.gameField,
        fieldArray[i],
      );

      gameFieldItem.id = fieldArray[i];
    }

    gameFieldItem.dataset.position = i;
    gameFieldItem.addEventListener('click', moveItem);
  }
}

//  init

const gameWrapper = createElement('div', 'wrapper', document.body);
const gameContainer = createElement('div', 'game', gameWrapper);
const gameHeader = createElement('div', 'game__header', gameContainer);

game.elements.timerTextEl = createElement('span', 'game__time', gameHeader, `00 : 00`);
game.elements.numberOfMovesTextEl = createElement('span', 'game__number-of-moves', gameHeader, `0`);

const gameSettings = createElement('button', 'game__settings', gameHeader, 'Settings');
const gamefieldArray = generateGameFieldArray();
game.elements.gameField = createElement('div', 'game__field', gameContainer);

generateGameField(gamefieldArray);
runGameTimer();
