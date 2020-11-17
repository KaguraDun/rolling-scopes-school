import {
  endGame,
  moveItem,
  handleDragOver,
  generateGameFieldArray,
  stopGameTimer,
  runGameTimer,
} from './game-logic';

export function createElement(tagName, className, parentName, innerText) {
  const element = document.createElement(tagName);

  element.classList.add(className);
  if (innerText) element.textContent = innerText;
  parentName.append(element);

  return element;
}

export function createGameSizeSelector(parentName) {
  const select = createElement('select', 'select', parentName);

  [3, 4, 5, 6, 7, 8].forEach((element) => {
    const option = createElement('option', 'select__option', select, `${element}x${element}`);
    option.value = element;
  });

  select[1].setAttribute('selected', true);
}

export function createEnableSoundButton(parentName, game) {
  const enableSoundButton = createElement('button', 'button', parentName, 'Звук выкл');

  enableSoundButton.addEventListener('click', () => {
    game.properties.enableSound = !game.properties.enableSound;

    if (game.properties.enableSound) {
      enableSoundButton.textContent = 'Звук вкл';
    } else {
      enableSoundButton.textContent = 'Звук выкл';
    }
  });
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

export function createBestResultsButton(parentName) {
  const bestResultsButton = createElement('button', 'button', parentName, 'Лучшие результаты');

  bestResultsButton.addEventListener('click', () => {
    const bestResultsWrapper = createBestResults(parentName);
    bestResultsWrapper.classList.toggle('--display-none');
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

export function generateGameField(fieldArray, game) {
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

    gameFieldItem.addEventListener('click', (event) => {
      moveItem(event, game);
    });

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

    gameFieldItem.addEventListener('dragover', (event) => {
      handleDragOver(event, game);
    });
  }
}

export function newGame(game) {
  game.properties.timer = 0;
  game.properties.numberOfMoves = 0;
  game.properties.fieldSize = document.querySelector('.select').value;

  game.elements.timerTextEl.textContent = '00 : 00';
  game.elements.numberOfMovesTextEl.textContent = 0;
  game.elements.gameField.innerHTML = '';

  const completeBanner = document.querySelector('.game__complete-banner');
  if (completeBanner) {
    completeBanner.classList.add('--display-none');
  }

  generateGameField(generateGameFieldArray(game.properties.fieldSize), game);
  stopGameTimer(game);
  runGameTimer(game);
}

export function createNewGameButton(parentName, game) {
  const newGameBtn = createElement('button', 'button', parentName, 'Новая игра');

  newGameBtn.addEventListener('click', () => {
    newGame(game);
  });

  return newGameBtn;
}

function createCompleteBanner(parent, game) {
  const completeBannerWrapper = createElement('div', 'game__complete-wrapper', parent);
  const completeBanner = createElement('div', 'game__complete-banner', completeBannerWrapper);

  game.elements.completeMessageTextEl = createElement(
    'div',
    'game__complete-message',
    completeBanner,
  );

  const newGameButton = createNewGameButton(completeBanner, game);
  newGameButton.classList.add('button--new-game');
  completeBannerWrapper.classList.add('--display-none');

  return completeBannerWrapper;
}

export function createAutoCompleteButton(parentName, game) {
  const gameAutoComplete = createElement('button', 'button', parentName, 'Решить в один клик!');

  gameAutoComplete.addEventListener('click', () => {
    const completeBanner = createCompleteBanner(parentName, game);
    completeBanner.classList.toggle('--display-none');
    endGame(game);
  });
}
