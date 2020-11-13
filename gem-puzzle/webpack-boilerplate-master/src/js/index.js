import '../styles/index.scss';

const game = {
  properties: {
    fieldSize: 3,
    timer: 0,
    numberOfMoves: 0,
  },

  elements: {
    gameContainer: null,
    gameField: null,
    completeBanner: null,
    completeMessageTextEl: null,
    timer: null,
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
  game.elements.timer = setInterval(() => {
    game.properties.timer += 1;
    const minutes = Math.floor(game.properties.timer / 60);
    const seconds = game.properties.timer - minutes * 60;
    game.elements.timerTextEl.textContent = `${minutes} : ${seconds}`;
  }, 1000);
}

function stopGameTimer() {
  clearInterval(game.elements.timer);
}

function arrayShuffle(array) {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const randomNumber = Math.floor(Math.random() * i + 1);
    const tempValue = array[i];

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

  return !!(positionSum % 2);
}

function generateGameFieldArray() {
  const fieldSize = game.properties.fieldSize * game.properties.fieldSize;
  const gameFieldArray = [];
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
  const elementPosition = element.dataset.position;
  const elementPrevSibling = element.previousSibling;
  const emptyCellPrevSibling = emptyCell.previousSibling;

  elementPrevSibling.after(emptyCell);
  emptyCellPrevSibling.after(element);

  element.dataset.position = emptyCell.dataset.position;
  emptyCell.dataset.position = elementPosition;
}

function checkIfGameSolved() {
  let rightPositionCounter = 0;

  for (let i = 1; i < game.elements.gameField.childNodes.length - 1; i += 1) {
    if (game.elements.gameField.childNodes[i].id === i) rightPositionCounter += 1;
  }

  //  Учитываем пустой элемент в самом начале
  if (rightPositionCounter === game.elements.gameField.childNodes.length - 2) {
    return true;
  }

  return false;
}

function endGame() {
  const { timer, numberOfMoves, fieldSize } = game.properties;
  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  const gameTime = `${minutes} : ${seconds}`;
  const timestamp = new Date();
  const message = `Ура! Вы решили головоломку ${fieldSize}*${fieldSize}\n за ${gameTime} и ${numberOfMoves} ходов`;
  game.elements.completeBanner.style.display = 'flex';
  game.elements.completeMessageTextEl.textContent = message;
  stopGameTimer();

  const addObject = function (timestamp, time, moves, size) {
    return {
      timestamp: timestamp,
      gameTime: time,
      numberOfMoves: moves,
      fieldSize: size,
    };
  };
  //  Записываем результат в local storage
  if (!localStorage.getItem('bestResults')) {
    localStorage.setItem(
      'bestResults',
      JSON.stringify([addObject(timestamp, gameTime, numberOfMoves, fieldSize)]),
    );
  } else {
    const results = JSON.parse(localStorage.getItem('bestResults'));

    results.sort((prev, next) => prev.numberOfMoves - next.numberOfMoves);
    results.sort((prev, next) => next.fieldSize - prev.fieldSize);

    if (results.length < 10) {
      results.unshift(addObject(timestamp, gameTime, numberOfMoves, fieldSize));
    } else {
      results.pop();
      results.unshift(addObject(timestamp, gameTime, numberOfMoves, fieldSize));
    }

    results.sort((prev, next) => prev.numberOfMoves - next.numberOfMoves);
    results.sort((prev, next) => next.fieldSize - prev.fieldSize);

    localStorage.setItem('bestResults', JSON.stringify(results));
  }
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

      if (checkIfGameSolved()) {
        endGame();
      }
    }
  }
}

function generateGameField(fieldArray) {
  const fieldSize = game.properties.fieldSize * game.properties.fieldSize;

  //  Добавим пустой div для того чтобы при выполнении функции swap у первой ячейки был предыдущий элемент
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
      // gameFieldItem.style.background = 'url(images/cat.jpg)';
    }

    gameFieldItem.dataset.position = i;
    gameFieldItem.addEventListener('click', moveItem);
  }
}

//  init
function newGame() {
  game.properties.timer = 0;
  game.properties.numberOfMoves = 0;

  game.elements.timerTextEl.textContent = '00 : 00';
  game.elements.numberOfMovesTextEl.textContent = 0;
  game.elements.gameField.innerHTML = '';
  game.elements.completeBanner.style.display = 'none';

  const gamefieldArray = generateGameFieldArray();
  generateGameField(gamefieldArray);
  runGameTimer();
}

function createBestResults(parentName) {
  const bestResultsButton = createElement('button', 'button', parentName, 'Лучшие результаты');
  const bestResultsWrapper = createElement('div', 'best-results__wrapper', parentName);
  const bestResultsContent = createElement('table', 'best-results__content', bestResultsWrapper);
  const bestResultsTable = createElement('table', 'best-results__table', bestResultsContent);
  let bestResultsTableRow = createElement('tr', 'best-results__table-row', bestResultsTable);

  ['№', 'Дата', 'Время игры', 'Число ходов', 'Размер игры'].forEach((el) =>
    createElement('th', 'best-results__table-header', bestResultsTableRow, el),
  );

  const results = JSON.parse(localStorage.getItem('bestResults'));
  for (let i = 0; i < 10; i += 1) {
    if (results && results[i]) {
      bestResultsTableRow = createElement('tr', 'best-results__table-row', bestResultsTable);
      const date = new Date(results[i].timestamp);
      const dateFormat = `${date.getDate()}.${
        date.getMonth() + 1
      }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

      createElement('td', 'best-results__table-cell', bestResultsTableRow, i + 1);
      createElement('td', 'best-results__table-cell', bestResultsTableRow, dateFormat);
      createElement('td', 'best-results__table-cell', bestResultsTableRow, results[i].gameTime);
      createElement(
        'td',
        'best-results__table-cell',
        bestResultsTableRow,
        String(results[i].numberOfMoves),
      );
      createElement(
        'td',
        'best-results__table-cell',
        bestResultsTableRow,
        `${results[i].fieldSize} х ${results[i].fieldSize}`,
      );
    }
  }

  bestResultsWrapper.classList.add('--display-none');

  bestResultsButton.addEventListener('click', () => {
    bestResultsWrapper.classList.toggle('--display-none');
  });
}

function createCompleteBanner() {
  game.elements.completeBanner = createElement(
    'div',
    'game__complete-wrapper',
    game.elements.gameContainer,
  );

  const completeBanner = createElement(
    'div',
    'game__complete-banner',
    game.elements.completeBanner,
  );

  game.elements.completeMessageTextEl = createElement(
    'span',
    "'game__complete-message",
    completeBanner,
  );

  const newGameBtn = createElement('button', 'button', completeBanner, 'New game');
  newGameBtn.addEventListener('click', newGame);

  game.elements.completeBanner.style.display = 'none';
}

const gameWrapper = createElement('div', 'wrapper', document.body);
game.elements.gameContainer = createElement('div', 'game', gameWrapper);
const gameButtonsWrapper = createElement(
  'div',
  'game__buttons-wrapper',
  game.elements.gameContainer,
);

createBestResults(gameButtonsWrapper);

const gameHeader = createElement('div', 'game__header', game.elements.gameContainer);

game.elements.timerTextEl = createElement('span', 'game__time', gameHeader, '00 : 00');
game.elements.numberOfMovesTextEl = createElement('span', 'game__number-of-moves', gameHeader, '0');

const gameSettings = createElement('button', 'game__settings', gameHeader, 'Решить в один клик');
game.elements.gameField = createElement('div', 'game__field', game.elements.gameContainer);

createCompleteBanner();

const gamefieldArray = generateGameFieldArray();

generateGameField(gamefieldArray);
runGameTimer();

// testing
gameSettings.addEventListener('click', endGame);
