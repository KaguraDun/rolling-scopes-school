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

function addZero(num) {
  return +num < 10 ? `0${num}` : num;
}

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
    game.elements.timerTextEl.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
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

function swapItems(item, emptyItem) {
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
  const gameTime = `${addZero(minutes)}:${addZero(seconds)}`;
  const timestamp = new Date();
  const message = `Ура! Вы решили головоломку ${fieldSize}*${fieldSize}`
    + '<br>'
    + ` за ${gameTime} и ${numberOfMoves} ходов`;

  game.elements.completeMessageTextEl.innerHTML = message;
  stopGameTimer();

  const addObject = (date, time, moves, size) => ({
    timestamp: date,
    gameTime: time,
    numberOfMoves: moves,
    fieldSize: size,
  });

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

  Object.keys(adjacentElements).forEach((key) => {
    if (adjacentElements[key] && adjacentElements[key].id === '0') {
      swapItems(e.target, adjacentElements[key]);
      game.properties.numberOfMoves += 1;
      game.elements.numberOfMovesTextEl.textContent = game.properties.numberOfMoves;

      if (checkIfGameSolved()) endGame();
    }
  });
}

function setItemBackground(gameFieldItem, image, itemValue, fieldSize) {
  const ITEM_SIZE = 3.25;

  const itemPositionX = itemValue % fieldSize;
  const itemPositionLeft = itemPositionX
    ? (itemPositionX - 1) * -ITEM_SIZE
    : (fieldSize - 1) * -ITEM_SIZE;

  const itemPositionY = Math.ceil(itemValue / fieldSize);
  const itemPositionTop = itemPositionY
    ? (itemPositionY - 1) * -ITEM_SIZE
    : (fieldSize - 1) * -ITEM_SIZE;

  gameFieldItem.style.background = `url(${image})`;
  gameFieldItem.style.backgroundPosition = `left ${itemPositionLeft}em top ${itemPositionTop}em`;
  gameFieldItem.style.backgroundSize = `${fieldSize * ITEM_SIZE}em ${fieldSize * ITEM_SIZE}em`;
}

function handleDragOver(event) {
  event.preventDefault();

  const activeElement = document.querySelector('.--selected');
  const currentElement = event.target;
  const emptyCell = document.getElementById('0');
  const emptyCellAdjacentElements = getAdjastmentElements(emptyCell);
  let isMoveable = false;

  Object.keys(emptyCellAdjacentElements).forEach((key) => {
    if (activeElement === emptyCellAdjacentElements[key]) {
      isMoveable = activeElement !== currentElement && currentElement.id === '0';
    }
  });

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
    5: '36px',
    6: '30px',
    7: '25.7px',
    8: '22.5px',
  };

  const IMAGE_COUNT = 150;
  const randomImageNumber = Math.floor(Math.random() * IMAGE_COUNT + 1);
  const backgroundImage = `assets/images/box/${randomImageNumber}.jpg`;

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

      setItemBackground(gameFieldItem, backgroundImage, fieldArray[i], game.properties.fieldSize);
    }

    gameFieldItem.dataset.row = Math.ceil((i + 1) / game.properties.fieldSize);
    const colNumber = (i + 1) % game.properties.fieldSize;
    gameFieldItem.dataset.col = colNumber === 0 ? game.properties.fieldSize : colNumber;

    gameFieldItem.dataset.position = i;

    gameFieldItem.draggable = true;

    gameFieldItem.addEventListener('click', moveItem);

    gameFieldItem.addEventListener('dragstart', (event) => {
      requestAnimationFrame(() => {
        event.target.classList.add('--selected');
      });
    });

    gameFieldItem.addEventListener('dragend', (event) => {
      event.srcElement.classList.remove('--selected');
      game.properties.numberOfMoves += 1;
      game.elements.numberOfMovesTextEl.textContent = game.properties.numberOfMoves;
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
  game.elements.completeBanner.classList.add('--display-none');

  game.properties.fieldSize = document.querySelector('.select').value;

  const gamefieldArray = generateGameFieldArray();
  generateGameField(gamefieldArray);
  stopGameTimer();
  runGameTimer();
}

function createBestResults(parentName) {
  let bestResultsWrapper = document.querySelector('.best-results__wrapper');
  let bestResultsContent = document.querySelector('.best-results__content');
  let bestResultsTableRow = document.querySelector('.best-results__table');

  if (bestResultsWrapper) {
    bestResultsTableRow.remove();
  } else {
    bestResultsWrapper = createElement('div', 'best-results__wrapper', parentName);
    bestResultsContent = createElement('div', 'best-results__content', bestResultsWrapper);
    bestResultsWrapper.classList.add('--display-none');
  }

  const bestResultsTable = createElement('table', 'best-results__table', bestResultsContent);
  bestResultsTableRow = createElement('tr', 'best-results__table-row', bestResultsTable);

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
  return bestResultsWrapper;
}

function createBestResultsButton(parentName) {
  const bestResultsButton = createElement('button', 'button', parentName, 'Лучшие результаты');

  bestResultsButton.addEventListener('click', () => {
    const bestResultsWrapper = createBestResults(parentName);
    bestResultsWrapper.classList.toggle('--display-none');
  });
}

function createNewGameButton(parentName) {
  const newGameBtn = createElement('button', 'button', parentName, 'Новая игра');
  newGameBtn.addEventListener('click', newGame);
  return newGameBtn;
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
    'div',
    'game__complete-message',
    completeBanner,
  );

  const newGameButton = createNewGameButton(completeBanner);
  newGameButton.classList.add('button--new-game');
  game.elements.completeBanner.classList.add('--display-none');
}

function createAutoCompleteButton(parentName) {
  const gameAutoComplete = createElement('button', 'button', parentName, 'Решить в один клик!');

  gameAutoComplete.addEventListener('click', () => {
    game.elements.completeBanner.classList.toggle('--display-none');
    endGame();
  });
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

  [3, 4, 5, 6, 7, 8].forEach((element) => {
    const option = createElement('option', 'select__option', select, `${element}x${element}`);
    option.value = element;
  });

  select[1].setAttribute('selected', true);
}

function createEnableSoundButton(parentName) {
  const enableSound = createElement('button', 'button', parentName, 'Звук выкл');

  enableSound.addEventListener('click', () => {
    game.properties.enableSound = !game.properties.enableSound;
    if (game.properties.enableSound) {
      enableSound.textContent = 'Звук вкл';
    } else {
      enableSound.textContent = 'Звук выкл';
    }
  });
}

createBestResultsButton(gameButtonsWrapper);
createNewGameButton(gameButtonsWrapper);
chooseGameSize(gameButtonsWrapper);
createAutoCompleteButton(gameButtonsWrapper);
createEnableSoundButton(gameButtonsWrapper);

const gameHeader = createElement('div', 'game__header', game.elements.gameContainer);

game.elements.timerTextEl = createElement('span', 'game__time', gameHeader, '00:00');
game.elements.numberOfMovesTextEl = createElement('span', 'game__number-of-moves', gameHeader, '0');

game.elements.gameField = createElement('div', 'game__field', game.elements.gameContainer);

const gamefieldArray = generateGameFieldArray();

generateGameField(gamefieldArray);
createCompleteBanner();
runGameTimer();
