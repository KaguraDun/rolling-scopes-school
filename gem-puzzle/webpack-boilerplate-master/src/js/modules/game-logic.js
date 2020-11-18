function addZero(num) {
  return +num < 10 ? `0${num}` : num;
}

export function runGameTimer(game) {
  game.elements.timer = setInterval(() => {
    game.properties.timer += 1;
    const minutes = Math.floor(game.properties.timer / 60);
    const seconds = game.properties.timer - minutes * 60;
    game.elements.timerTextEl.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
  }, 1000);
}

export function stopGameTimer(game) {
  clearInterval(game.elements.timer);
}

function setBestResult(bestResults) {
  if (!localStorage.getItem('bestResults')) {
    localStorage.setItem('bestResults', JSON.stringify([bestResults]));
  } else {
    const results = JSON.parse(localStorage.getItem('bestResults'));

    if (results.length < 10) {
      results.unshift(bestResults);
    } else {
      results.pop();
      results.unshift(bestResults);
    }

    results.sort((prev, next) => prev.numberOfMoves - next.numberOfMoves);
    results.sort((prev, next) => next.fieldSize - prev.fieldSize);

    localStorage.setItem('bestResults', JSON.stringify(results));
  }
}

function checkIfGameSolved() {
  const gameFieldchildNodes = document.querySelector('.game__field').childNodes;
  let rightPositionCounter = 0;

  for (let i = 1; i < gameFieldchildNodes.length - 1; i += 1) {
    if (gameFieldchildNodes[i].id === gameFieldchildNodes[i].dataset.position) {
      rightPositionCounter += 1;
    }
  }

  //  Учитываем пустой элемент в самом начале
  if (rightPositionCounter === gameFieldchildNodes.length - 2) {
    return true;
  }

  return false;
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

export function endGame(game) {
  const { timer, numberOfMoves, fieldSize } = game.properties;
  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  const gameTime = `${addZero(minutes)}:${addZero(seconds)}`;
  const timestamp = new Date();
  const message = `Ура! Вы решили головоломку ${fieldSize}*${fieldSize}`
    + '<br>'
    + ` за ${gameTime} и ${numberOfMoves} ходов`;

  if (game.elements.completeMessageTextEl) {
    game.elements.completeMessageTextEl.innerHTML = message;
  }

  stopGameTimer(game);

  const bestResults = (date, time, moves, size) => ({
    timestamp: date,
    gameTime: time,
    numberOfMoves: moves,
    fieldSize: size,
  });

  setBestResult(bestResults(timestamp, gameTime, numberOfMoves, fieldSize));
}

function setAnimation(item, position) {
  const ITEM_SIZE = '3.25em';

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

  setTimeout(() => {
    requestAnimationFrame(() => {
      item.style.transform = 'none';
      item.style.removeProperty('transform');
    });
  }, 10);
}

function playSoundEffect() {
  const swapSound = new Audio();
  swapSound.src = 'assets/audio/swap-sound.mp3';
  swapSound.play();
}

function swapItems(item, emptyItem, position, game) {
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
    playSoundEffect();
  }

  setAnimation(item, position);
}

export function moveItem(event, game) {
  const adjacentElements = getAdjastmentElements(event.target);

  Object.keys(adjacentElements).forEach((key) => {
    if (adjacentElements[key] && adjacentElements[key].id === '0') {
      swapItems(event.target, adjacentElements[key], key, game);
      game.properties.numberOfMoves += 1;
      game.elements.numberOfMovesTextEl.textContent = game.properties.numberOfMoves;

      if (checkIfGameSolved()) {
        game.elements.completeBanner.classList.toggle('--display-none');
        endGame(game);
      }
    }
  });
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

  return positionSum % 2 === 0;
}

export function generateGameFieldArray(gamefieldSize) {
  const fieldSize = gamefieldSize * gamefieldSize;
  const gameFieldArray = [];
  let findSolution = false;

  for (let i = 1; i < fieldSize; i += 1) {
    gameFieldArray.push(i);
  }

  while (findSolution !== true) {
    arrayShuffle(gameFieldArray);
    if (solvabilityCheck(gameFieldArray)) {
      findSolution = true;
    }
  }

  return gameFieldArray;
}

export function handleDragOver(event, game) {
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

  swapItems(activeElement, emptyCell, null, game);
}
