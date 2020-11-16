import '../styles/index.scss';

const game = {
  properties: {
    fieldSize: 4,
    timer: 0,
    numberOfMoves: 0,
    enableSound: false,
  },

  elements: {
    gameContainer: null,
    gameField: null,
    completeBanner: null,
    completeMessageTextEl: null,
    timer: null,
    timerTextEl: null,
    numberOfMovesTextEl: null,
    currentDroppable: null,
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

function swapItems(item, emptyItem, position) {
  const ITEM_SIZE = '3.25em';
  const itemRow = item.dataset.row;
  const itemCol = item.dataset.col;
  const emptyItemRow = emptyItem.dataset.row;
  const emptyItemCol = emptyItem.dataset.col;
  const itemPrevSibling = item.previousSibling;
  const emptyItemPrevSibling = emptyItem.previousSibling;
  const itemPosition = item.dataset.position;

  itemPrevSibling.after(emptyItem);
  emptyItemPrevSibling.after(item);

  item.dataset.position = emptyItem.dataset.position;
  emptyItem.dataset.position = itemPosition;

  item.dataset.row = emptyItemRow;
  item.dataset.col = emptyItemCol;
  emptyItem.dataset.row = itemRow;
  emptyItem.dataset.col = itemCol;

  // animation
  switch (position) {
    case 'up':
      item.style.transform = `translateY(${ITEM_SIZE})`;
      break;
    case 'bottom':
      item.style.transform = `translateY(-${ITEM_SIZE})`;
      break;
    case 'left':
      item.style.transform = `translateX(${ITEM_SIZE})`;
      break;
    case 'right':
      item.style.transform = `translateX(-${ITEM_SIZE})`;
      break;
    default:
  }

  requestAnimationFrame(() => {
    item.style.transform = 'none';
  });

  game.properties.numberOfMoves += 1;
  game.elements.numberOfMovesTextEl.textContent = game.properties.numberOfMoves;

  if (game.properties.enableSound) {
    const swapSound = new Audio();
    swapSound.src = 'assets/audio/swap-sound.mp3';
    swapSound.play();
  }
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
  const message = `Ура! Вы решили головоломку ${fieldSize}*${fieldSize}`
    + '<br>'
    + ` за ${gameTime} и ${numberOfMoves} ходов`;
  game.elements.completeBanner.style.display = 'flex';
  game.elements.completeMessageTextEl.innerHTML = message;
  stopGameTimer();

  const addObject = function (date, time, moves, size) {
    return {
      timestamp: date,
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

function getAdjastmentElements(element) {
  const elementRow = Number(element.dataset.row);
  const elementCol = Number(element.dataset.col);

  return {
    up: document.querySelector(`[data-row="${elementRow - 1}"][data-col="${elementCol}"]`),
    bottom: document.querySelector(`[data-row="${elementRow + 1}"][data-col="${elementCol}"]`),
    left: document.querySelector(`[data-row="${elementRow}"][data-col="${elementCol - 1}"]`),
    right: document.querySelector(`[data-row="${elementRow}"][data-col="${elementCol + 1}"]`),
  };
}

function moveItem(e) {
  const adjacentElements = getAdjastmentElements(e.target);

  for (const key in adjacentElements) {
    if (adjacentElements[key] && adjacentElements[key].id === '0') {
      swapItems(e.target, adjacentElements[key], key);

      if (checkIfGameSolved()) endGame();
    }
  }
}

function handleDragOver(event) {
  event.preventDefault();

  const activeElement = document.querySelector('.--selected');
  const currentElement = event.target;
  const emptyCell = document.getElementById('0');
  const emptyCellAdjacentElements = getAdjastmentElements(emptyCell);
  let isMoveable = false;

  for (const key in emptyCellAdjacentElements) {
    if (activeElement === emptyCellAdjacentElements[key]) {
      isMoveable = activeElement !== currentElement && currentElement.id === '0';
    }
  }

  if (!isMoveable) {
    return;
  }

  swapItems(activeElement, emptyCell);
}

function generateGameField(fieldArray) {
  const fieldSize = game.properties.fieldSize * game.properties.fieldSize;

  const itemTextSizes = {
    3: '60px',
    4: '45px',
    5: '35px',
    6: '30px',
    7: '25px',
    8: '23px',
  };

  game.elements.gameField.style.fontSize = itemTextSizes[game.properties.fieldSize];

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
    }

    gameFieldItem.dataset.row = Math.ceil((i + 1) / game.properties.fieldSize);
    const colNumber = (i + 1) % game.properties.fieldSize;
    gameFieldItem.dataset.col = colNumber === 0 ? game.properties.fieldSize : colNumber;

    gameFieldItem.dataset.position = i;
    gameFieldItem.draggable = true;

    gameFieldItem.addEventListener('click', moveItem);

    gameFieldItem.addEventListener('dragstart', (event) => {
      event.target.classList.add('--selected');
    });

    gameFieldItem.addEventListener('dragend', (event) => {
      event.target.classList.remove('--selected');
    });

    gameFieldItem.addEventListener('dragover', handleDragOver);
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

  game.properties.fieldSize = document.querySelector('.select').value;

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

  ['№', 'Дата', 'Время игры', 'Число ходов', 'Размер игры'].forEach((el) => {
    createElement('th', 'best-results__table-header', bestResultsTableRow, el);
  });

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

function createNewGameButton(parentName) {
  const newGameBtn = createElement('button', 'button', parentName, 'Новая игра');
  newGameBtn.addEventListener('click', newGame);
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

  createNewGameButton(completeBanner);

  game.elements.completeBanner.style.display = 'none';
}

function createAutoCompleteButton(parentName) {
  const gameAutoComplete = createElement('button', 'button', parentName, 'Решить в один клик');
  gameAutoComplete.addEventListener('click', endGame);
}

const gameWrapper = createElement('div', 'wrapper', document.body);
game.elements.gameContainer = createElement('div', 'game', gameWrapper);
const gameButtonsWrapper = createElement(
  'div',
  'game__buttons-wrapper',
  game.elements.gameContainer,
);

function chooseGameSize(parentName) {
  const select = createElement('select', 'select', parentName);

  [3, 4, 5, 6, 7, 8].forEach((el) => {
    const option = createElement('option', 'select__option', select, `${el}x${el}`);
    option.value = el;
  });

  select[1].setAttribute('selected', true);
}

function createEnableSoundButton(parentName) {
  const enableSound = createElement('button', 'button', parentName, 'Звук выкл');

  enableSound.addEventListener('click', () => {
    console.log(this);
    game.properties.enableSound = !game.properties.enableSound;
    if (game.properties.enableSound) {
      enableSound.textContent = 'Звук вкл';
    } else {
      enableSound.textContent = 'Звук выкл';
    }
  });
}

createBestResults(gameButtonsWrapper);
createNewGameButton(gameButtonsWrapper);
chooseGameSize(gameButtonsWrapper);
createAutoCompleteButton(gameButtonsWrapper);
createEnableSoundButton(gameButtonsWrapper);

const gameHeader = createElement('div', 'game__header', game.elements.gameContainer);

game.elements.timerTextEl = createElement('span', 'game__time', gameHeader, '00 : 00');
game.elements.numberOfMovesTextEl = createElement('span', 'game__number-of-moves', gameHeader, '0');

game.elements.gameField = createElement('div', 'game__field', game.elements.gameContainer);

createCompleteBanner();

const gamefieldArray = generateGameFieldArray();

generateGameField(gamefieldArray);
runGameTimer();
