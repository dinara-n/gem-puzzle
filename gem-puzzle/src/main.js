/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import './style.css';
import Board from './board';
import './assets/tile-move-short.mp3';
import './assets/apple-icon-180x180.png';
import './assets/sound-icon-30x30.png';

const audioTileMoving = new Audio('./assets/tile-move-short.mp3');
audioTileMoving.volume = 0.3;
audioTileMoving.muted = true;

document.addEventListener('DOMContentLoaded', () => {
  function addHtmlElement(tag, text = '', container = document.body, cssClass = '') {
    const element = document.createElement(tag);
    element.textContent = text;
    element.classList.add(cssClass);
    container.append(element);
    return element;
  }

  const mainContainer = addHtmlElement('main', null, document.body, 'main-container');
  const gameControls = addHtmlElement('section', null, mainContainer, 'game-controls');
  // const sizeLabel = addHtmlElement('label', 'Size:', gameControls, 'game-controls__size-label');
  // sizeLabel.htmlFor = 'board-size';
  const sizeSelect = addHtmlElement('select', null, gameControls, 'game-controls__size');
  sizeSelect.name = 'board-size';
  for (let size = 3; size <= 8; size += 1) {
    const sizeSelectOption = addHtmlElement('option', `${size} x ${size}`, sizeSelect, 'game-controls__size-select');
    sizeSelectOption.value = size;
  }
  sizeSelect.value = 4;
  const btnNew = addHtmlElement('button', 'New Game', gameControls, 'game-controls__btn');
  btnNew.classList.add('game-controls__btn--new');
  const btnSave = addHtmlElement('button', 'Save', gameControls, 'game-controls__btn');
  btnSave.classList.add('game-controls__btn--save');
  const btnSaved = addHtmlElement('button', 'Saved Game', gameControls, 'game-controls__btn');
  btnSaved.classList.add('game-controls__btn--saved');
  const btnRecords = addHtmlElement('button', 'Records', gameControls, 'game-controls__btn');
  btnRecords.classList.add('game-controls__btn--records');
  const btnSound = addHtmlElement('button', '', gameControls, 'game-controls__btn');
  btnSound.classList.add('game-controls__btn--sound');
  btnSound.ariaLabel = 'Sound';
  const gameInfo = addHtmlElement('section', null, mainContainer, 'game-info');
  const gameTime = addHtmlElement('p', '', gameInfo, 'game-info__time');
  const gameTimer = addHtmlElement('span', '0:0', gameTime, 'game-info__timer');
  const gameMoves = addHtmlElement('p', 'Moves: ', gameInfo, 'game-info__moves');
  const gameMovesNumber = addHtmlElement('span', '0', gameMoves, 'game-info__moves-number');
  const gameBoardWrapper = addHtmlElement('section', null, mainContainer, 'gameboard-wrapper');
  const gameBoard = addHtmlElement('canvas', 'Sorry! It seems your browser does not support HTML Canvas. Please try another browser.', gameBoardWrapper, 'gameboard');
  gameBoard.width = 300;
  gameBoard.height = 300;
  // if (window.matchMedia('(max-width: 767px)').matches) {
  //   console.log('aaaaa');
  //   gameBoard.width = 300;
  //   gameBoard.height = 300;
  // }

  const pageBackground = addHtmlElement('canvas', '', document.body, 'page-background');
  pageBackground.width = window.innerWidth;
  pageBackground.height = window.innerHeight;

  const gameSettings = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameSettings')) || {};
  if (gameSettings.sound) {
    audioTileMoving.muted = false;
    btnSound.classList.add('sound-on');
  }

  const gameRecords = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameRecords')) || [];
  console.log(gameRecords);

  let startingTime = Math.trunc(Date.now() / 1000);

  function iterateTime() {
    const time = Math.trunc(Date.now() / 1000) - startingTime;
    let minutes = Math.trunc(time / 60);
    minutes = (minutes > 9) ? minutes : `0${minutes}`;
    let seconds = time % 60;
    seconds = (seconds > 9) ? seconds : `0${seconds}`;
    gameTimer.textContent = `${minutes} : ${seconds}`;
  }
  setInterval(iterateTime, 100);
  // const showTime = setInterval(() => iterateTime, 100);

  // function stopIteratingTime() {
  //   clearInterval(showTime);
  // }

  // showTime();

  let board = new Board(gameBoard, +sizeSelect.value, 8);
  console.log(board);
  // const gameBoardTiles = [];
  const ctx = gameBoard.getContext('2d');
  let xShift = 0;
  let yShift = 0;
  // let xOffset = 0;
  // let yOffset = 0;
  let xDirection = null;
  let yDirection = null;
  let tileSwapComplete = false;
  let isTileDragged = false;
  let mouseX = 0;
  let mouseY = 0;
  let mouseXOffset = 0;
  let mouseYOffset = 0;
  let isBoardDrawn = true;
  console.log(ctx);

  function drawSquare(tile, xStart, xEnd, yStart, yEnd, curve) {
    tile.moveTo(xStart, yStart + curve);
    tile.quadraticCurveTo(xStart, yStart, xStart + curve, yStart);
    tile.lineTo(xEnd - curve, yStart);
    tile.quadraticCurveTo(xEnd, yStart, xEnd, yStart + curve);
    tile.lineTo(xEnd, yEnd - curve);
    tile.quadraticCurveTo(xEnd, yEnd, xEnd - curve, yEnd);
    tile.lineTo(xStart + curve, yEnd);
    tile.quadraticCurveTo(xStart, yEnd, xStart, yEnd - curve);
    tile.lineTo(xStart, yStart + curve);
    // tile.fillText(text, 20, 20);
  }

  // eslint-disable-next-line no-shadow
  function drawTile(ctx, elem, i) {
    // const ctx = gameBoard.getContext('2d');
    const offsetPerFrame = (board.tileSize + board.gapSize) / 50;
    let tileNumber = elem;
    let {
      xStart, xEnd, yStart, yEnd,
    } = { ...board.tilesCoords[i] };

    if (board.areTilesSwapping) {
      ctx.clearRect(board.movingTilePrevCoords.xStart - 2, board.movingTilePrevCoords.yStart - 2, board.tileSize + 4, board.tileSize + 4);
      tileNumber = board.array[board.tileTarget];
      // console.log(board.movingTilePrevCoords);
      // console.log(board.areTilesSwapping, tileSwapComplete);

      // If tile reached destination

      if ((xDirection === 'right' && (board.movingTilePrevCoords.xStart + xShift >= board.movingTileNewCoords.xStart))
      || (xDirection === 'left' && (board.movingTilePrevCoords.xStart + xShift <= board.movingTileNewCoords.xStart))) {
        xShift = 0;
        xDirection = null;
        xStart = board.movingTileNewCoords.xStart;
        xEnd = board.movingTileNewCoords.xEnd;
        board.movingTilePrevCoords = null;
        board.movingTileNewCoords = null;
        tileSwapComplete = true;
        board.areTilesSwapping = false;
        board.tileToSwap = null;
        board.tileTarget = null;
      } else {
        // If tile is still moving

        xShift = (xDirection === 'right') ? (xShift + offsetPerFrame) : (xDirection === 'left') ? (xShift - offsetPerFrame) : xShift;
        if (xDirection === 'right' || xDirection === 'left') {
          board.movingTilePrevCoords.xStart += xShift;
          board.movingTilePrevCoords.xEnd += xShift;
          xStart = board.movingTilePrevCoords.xStart;
          xEnd = board.movingTilePrevCoords.xEnd;
        }
      }

      // If tile reached destination

      if ((yDirection === 'down' && (board.movingTilePrevCoords.yStart + yShift >= board.movingTileNewCoords.yStart))
      || (yDirection === 'up' && (board.movingTilePrevCoords.yStart + yShift <= board.movingTileNewCoords.yStart))) {
        yShift = 0;
        yDirection = null;
        yStart = board.movingTileNewCoords.yStart;
        yEnd = board.movingTileNewCoords.yEnd;
        board.movingTilePrevCoords = null;
        board.movingTileNewCoords = null;
        tileSwapComplete = true;
        board.areTilesSwapping = false;
        board.tileToSwap = null;
        board.tileTarget = null;
      } else {
        // If tile is still moving

        yShift = (yDirection === 'down') ? (yShift + offsetPerFrame) : (yDirection === 'up') ? (yShift - offsetPerFrame) : yShift;
        if (yDirection === 'down' || yDirection === 'up') {
          board.movingTilePrevCoords.yStart += yShift;
          board.movingTilePrevCoords.yEnd += yShift;
          yStart = board.movingTilePrevCoords.yStart;
          yEnd = board.movingTilePrevCoords.yEnd;
        }
      }
    }

    if (isTileDragged && isBoardDrawn) {
      tileNumber = board.array[board.tileMovingIndex];
      xStart = mouseX - mouseXOffset;
      xEnd = xStart + board.tileSize;
      yStart = mouseY - mouseYOffset;
      yEnd = yStart + board.tileSize;
      // console.log('animation on drag');
      // console.log(xStart, xEnd, yStart, yEnd);
      // drawBoard();
    }

    const tile = new Path2D();
    ctx.beginPath();
    drawSquare(tile, xStart, xEnd, yStart, yEnd, 5);
    // ctx.fillStyle = 'orange';
    // ctx.fill(tile);
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'rgb(247, 205, 9)';
    ctx.stroke(tile);
    ctx.fillStyle = 'rgb(247, 205, 9)';
    // ctx.fillStyle = 'black';
    ctx.font = `${board.tileSize * 0.5}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(tileNumber, xStart + (board.tileSize - ctx.measureText(tileNumber).width) * 0.5, yStart + board.tileSize * 0.5);

    if (board.areTilesSwapping && !tileSwapComplete) {
      console.log('animation on click');
      // drawBoard();
      // eslint-disable-next-line prefer-arrow-callback, func-names
      window.requestAnimationFrame(function () { drawTile(ctx, board.array[board.tileToSwap], board.tileToSwap); });
    }

    if (isTileDragged && isBoardDrawn) {
      isBoardDrawn = false;
    }
  }

  function drawBoard() {
    if (gameBoard.getContext) {
      ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
      board.array.forEach((elem, i) => {
        if (elem && (i !== board.tileMovingIndex)) {
          drawTile(ctx, elem, i);
        }
      });
      isBoardDrawn = true;
    }
  }

  drawBoard();

  // window.matchMedia('(max-width: 767px)').addEventListener('change', () => {
  //   console.log('small');
  // gameBoard.remove();
  // gameBoard = addHtmlElement('canvas', 'Sorry! It seems your browser does not support HTML Canvas. Please try another browser.', gameBoardWrapper, 'gameboard');
  // gameBoardWrapper.append(gameBoard);
  // gameBoard.width = 300;
  // gameBoard.height = 300;
  // board.recalculateStats();
  // console.log(board);
  // drawBoard();
  // });

  // window.matchMedia('(min-width: 768px)').addEventListener('change', () => {
  //   console.log('big');
  // gameBoard.remove();
  // gameBoard = addHtmlElement('canvas', 'Sorry! It seems your browser does not support HTML Canvas. Please try another browser.', gameBoardWrapper, 'gameboard');
  // gameBoardWrapper.append(gameBoard);
  // gameBoard.width = 500;
  // gameBoard.height = 500;
  // board.recalculateStats();
  // console.log(board);
  // drawBoard();
  // });

  // Listening to Board Size Selection

  sizeSelect.addEventListener('change', () => {
    board = new Board(gameBoard, +sizeSelect.value, 8);
    drawBoard();
    board.movesNumber = 0;
    // board.gapSize = (+sizeSelect.value > 5) ? 4 : 8;
    gameMovesNumber.textContent = board.movesNumber;
    console.log(board);
    clearInterval(iterateTime);
    // stopIteratingTime();
    startingTime = Math.trunc(Date.now() / 1000);
    setInterval(iterateTime, 100);
    // iterateTime();
    gameTime.style.color = 'white';
    gameMoves.style.color = 'white';
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // Listening to New Game button

  btnNew.addEventListener('click', () => {
    board = new Board(gameBoard, +sizeSelect.value, 8);
    drawBoard();
    board.movesNumber = 0;
    gameMovesNumber.textContent = board.movesNumber;
    clearInterval(iterateTime);
    // stopIteratingTime();
    startingTime = Math.trunc(Date.now() / 1000);
    setInterval(iterateTime, 100);
    // iterateTime();
    gameTime.style.color = 'white';
    gameMoves.style.color = 'white';
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // Listening to Save button

  btnSave.addEventListener('click', () => {
    const gameStats = {};
    gameStats.size = sizeSelect.value;
    gameStats.timer = gameTimer.textContent;
    gameStats.moves = gameMovesNumber.textContent;
    gameStats.array = board.array.slice();
    gameStats.zIndex = board.zIndex;
    localStorage.setItem('gemPuzzleByDinaraN_gameStats', JSON.stringify(gameStats));
  });

  // Listening to Saved Game button

  btnSaved.addEventListener('click', () => {
    const gameStats = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameStats'));
    sizeSelect.value = gameStats.size;
    clearInterval(iterateTime);
    // stopIteratingTime();
    const savedTime = +gameStats.timer.split(':')[0] * 60 + +gameStats.timer.split(':')[1];
    startingTime = Math.trunc(Date.now() / 1000) - savedTime;
    setInterval(iterateTime, 100);
    // iterateTime();
    board = new Board(gameBoard, +sizeSelect.value, 8);
    board.array = gameStats.array.slice();
    board.zeroIndex = board.getZeroIndex();
    board.movesNumber = +gameStats.moves;
    gameMovesNumber.textContent = board.movesNumber;
    drawBoard();
    gameTime.style.color = 'white';
    gameMoves.style.color = 'white';
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // Listening to Sound button

  btnSound.addEventListener('click', () => {
    if (btnSound.classList.contains('sound-on')) {
      audioTileMoving.muted = true;
      btnSound.classList.remove('sound-on');
    } else {
      audioTileMoving.muted = false;
      btnSound.classList.add('sound-on');
    }
    gameSettings.sound = btnSound.classList.contains('sound-on');
    localStorage.setItem('gemPuzzleByDinaraN_gameSettings', JSON.stringify(gameSettings));
  });

  // Listening to Records button

  btnRecords.addEventListener('click', () => {
    clearInterval(iterateTime);
    // stopIteratingTime();
    const gameRecordsPopUp = addHtmlElement('div', null, document.body, 'game-records-popup');
    if (gameRecords.length === 0) {
      const gameRecordsMessage = addHtmlElement('h2', 'You have not won any games yet!', gameRecordsPopUp, 'game-records-message');
    } else {
      const gameRecordsTable = addHtmlElement('table', null, gameRecordsPopUp, 'game-records-table');
      const gameRecordsTableHeader = addHtmlElement('tr', null, gameRecordsTable, 'game-records-table__header');
      const gameRecordsTableHeaderNo = addHtmlElement('th', 'Place', gameRecordsTableHeader, 'game-records-table__header-cell');
      const gameRecordsTableHeaderTime = addHtmlElement('th', 'Time', gameRecordsTableHeader, 'game-records-table__header-cell');
      const gameRecordsTableHeaderMoves = addHtmlElement('th', 'Moves', gameRecordsTableHeader, 'game-records-table__header-cell');
      gameRecords.forEach((elem, i) => {
        const gameRecordsTableRow = addHtmlElement('tr', null, gameRecordsTable, 'game-records-table__row');
        const gameRecordsTableRowNo = addHtmlElement('td', i + 1, gameRecordsTableRow, 'game-records-table__row-cell');
        const gameRecordsTableRowTime = addHtmlElement('td', elem.time, gameRecordsTableRow, 'game-records-table__row-cell');
        const gameRecordsTableRowMoves = addHtmlElement('td', elem.moves, gameRecordsTableRow, 'game-records-table__row-cell');
      });
    }

    // Listening to Close Records pop-up

    gameRecordsPopUp.addEventListener('click', () => {
      // setInterval(iterateTime, 100);
      // iterateTime();
      gameRecordsPopUp.remove();
    });
    window.addEventListener('keydown', (keyDown) => {
      if (keyDown.key === 'Escape') {
        gameRecordsPopUp.remove();
      }
    });
  });

  function showWinningMessage() {
    console.log('Solved!');
    clearInterval(iterateTime);
    // stopIteratingTime();
    gameTime.style.color = 'black';
    gameMoves.style.color = 'black';
    const gameSolvedPopUp = addHtmlElement('div', null, document.body, 'game-solved-popup');
    const gameSolvedPopUpMessage = addHtmlElement('h2', `Hooray! You solved the puzzle in ${gameTimer.textContent} and ${board.movesNumber} moves!`, gameSolvedPopUp, 'game-solved-popup__message');
    gameSolvedPopUp.addEventListener('click', () => {
      gameSolvedPopUp.remove();
    });
    window.addEventListener('keydown', (keyDown) => {
      if (keyDown.key === 'Escape') {
        gameSolvedPopUp.remove();
      }
    });
  }

  function updateRecords() {
    const time = gameTimer.textContent;
    const moves = board.movesNumber;
    gameRecords.push({ time, moves });
    gameRecords.sort((a, b) => a.moves - b.moves);
    gameRecords.length = (gameRecords.length > 10) ? 10 : gameRecords.length;
    console.log(gameRecords);
    localStorage.setItem('gemPuzzleByDinaraN_gameRecords', JSON.stringify(gameRecords));
  }

  function boardDrag(evt) {
    evt.preventDefault();
    gameBoard.removeEventListener('mouseup', boardMouseClick);
    // gameBoard.removeEventListener('mousemove', boardDrag);
    document.body.addEventListener('mouseup', boardStopDrag);
    // console.log('mousemove');

    if (isTileDragged) {
      const bounding = gameBoard.getBoundingClientRect();
      mouseX = evt.clientX - bounding.left;
      mouseY = evt.clientY - bounding.top;
      drawBoard();
      drawTile(ctx, board.array[board.tileMovingIndex], board.tileMovingIndex);
    }
    // console.log(mouseX, mouseY);
    if (!isTileDragged) {
      console.log('mousemove');
      for (let i = 0; i < board.boardLength; i += 1) {
        const elem = board.tilesCoords[i];
        // console.log(elem.xStart);
        if ((mouseX >= elem.xStart) && (mouseX <= elem.xEnd) && (mouseY >= elem.yStart) && (mouseY <= elem.yEnd) && board.checkTileCanMove(i)) {
          mouseXOffset = mouseX - elem.xStart;
          mouseYOffset = mouseY - elem.yStart;
          isTileDragged = true;
          board.tileMovingIndex = i;
          // drawBoard();
          // // eslint-disable-next-line no-loop-func, prefer-arrow-callback
          // window.requestAnimationFrame(function () { drawTile(ctx, board.array[i], i); });
          break;
        }
      }
    }
  }

  function boardStopDrag() {
    gameBoard.removeEventListener('mousemove', boardDrag);
    gameBoard.removeEventListener('mouseup', boardStopDrag);
    const zeroCoords = board.tilesCoords[board.zeroIndex];
    if (isTileDragged && (mouseX >= zeroCoords.xStart) && (mouseX <= zeroCoords.xEnd) && (mouseY >= zeroCoords.yStart) && (mouseY <= zeroCoords.yEnd)) {
      console.log('yes');
      console.log(`board.tileMovingIndex: ${board.tileMovingIndex}, board.zeroIndex: ${board.zeroIndex}`);
      const coords = board.tilesCoords;
      [board.array[board.tileMovingIndex], board.array[board.zeroIndex]] = [board.array[board.zeroIndex], board.array[board.tileMovingIndex]];
      board.zeroIndex = board.tileMovingIndex;
      // [coords[board.tileMovingIndex].xStart, coords[board.zeroIndex].xStart] = [coords[board.zeroIndex].xStart, coords[board.tileMovingIndex].xStart];
      // [coords[board.tileMovingIndex].xEnd, coords[board.zeroIndex].xEnd] = [coords[board.zeroIndex].xEnd, coords[board.tileMovingIndex].xEnd];
      // [coords[board.tileMovingIndex].yStart, coords[board.zeroIndex].yStart] = [coords[board.zeroIndex].yStart, coords[board.tileMovingIndex].yStart];
      // [coords[board.tileMovingIndex].yEnd, coords[board.zeroIndex].yEnd] = [coords[board.zeroIndex].yEnd, coords[board.tileMovingIndex].yEnd];
      // board.tilesCoords = board.getTilesCoords();
      board.movesNumber += 1;
      gameMovesNumber.textContent = board.movesNumber;

      if (board.isSolved()) {
        gameBoard.removeEventListener('mousedown', boardMouseDown);
        showWinningMessage();
        if ((gameRecords.at(-1) && board.movesNumber < +gameRecords.at(-1).moves) || gameRecords.length < 10) {
          updateRecords();
        }
      }
    }
    console.log(board.array);
    // isBoardDrawn = false;
    // drawBoard();
    isTileDragged = false;
    board.tileMovingIndex = null;
    mouseX = 0;
    mouseY = 0;
    mouseXOffset = 0;
    mouseYOffset = 0;
    isBoardDrawn = false;
    drawBoard();
    // console.log(`Stopping drag, isTileDrag = ${isTileDragged}, board.tileMovingIndex = ${board.tileMovingIndex}`);
  }

  function boardMouseDown(evt) {
    const bounding = gameBoard.getBoundingClientRect();
    mouseX = evt.clientX - bounding.left;
    mouseY = evt.clientY - bounding.top;

    // gameBoard.addEventListener('mousemove', boardDrag);
    gameBoard.addEventListener('mouseup', boardMouseClick);
  }

  function boardMouseClick(evt) {
    gameBoard.removeEventListener('mousemove', boardDrag);
    gameBoard.removeEventListener('mouseup', boardMouseClick);
    console.log('click');
    // console.log(`Clicking, isTileDrag = ${isTileDragged}, board.tileMovingIndex = ${board.tileMovingIndex}`);
    const bounding = gameBoard.getBoundingClientRect();
    const x = evt.clientX - bounding.left;
    const y = evt.clientY - bounding.top;
    // console.log(x, y);
    for (let i = 0; i < board.boardLength; i += 1) {
      const elem = board.tilesCoords[i];
      // console.log(elem.xStart);
      if ((x >= elem.xStart) && (x <= elem.xEnd) && (y >= elem.yStart) && (y <= elem.yEnd)) {
        board.swapTiles(i);
        if (board.areTilesSwapping) {
          audioTileMoving.play();
          xDirection = (board.movingTileNewCoords.xStart > board.movingTilePrevCoords.xStart) ? 'right' : (board.movingTileNewCoords.xStart < board.movingTilePrevCoords.xStart) ? 'left' : null;
          yDirection = (board.movingTileNewCoords.yStart > board.movingTilePrevCoords.yStart) ? 'down' : (board.movingTileNewCoords.yStart < board.movingTilePrevCoords.yStart) ? 'up' : null;
          // console.log(board.movingTilePrevCoords, board.movingTileNewCoords);
          // console.log(board.tileToSwap);
          tileSwapComplete = false;
          // eslint-disable-next-line prefer-arrow-callback, func-names, no-loop-func
          window.requestAnimationFrame(function () { drawTile(ctx, board.array[board.tileToSwap], board.tileToSwap); });
          board.zeroIndex = i;
          gameMovesNumber.textContent = board.movesNumber;
        }
        // board.areTilesSwapping = false;
        break;
      }
    }
    if (board.isSolved()) {
      gameBoard.removeEventListener('mousedown', boardMouseDown);
      showWinningMessage();
      if ((gameRecords.at(-1) && board.movesNumber < +gameRecords.at(-1).moves) || gameRecords.length < 10) {
        updateRecords();
      }
    }
  }

  gameBoard.addEventListener('mousedown', boardMouseDown);

  // Page background - Stars

  function drawStarsBg() {
    const starsNumber = Math.trunc(Math.random() * window.innerWidth * window.innerHeight * 0.001) + 30;
    console.log(`Stars number: ${starsNumber}`);
    const stars = [];
    for (let i = 0; i < starsNumber; i += 1) {
      const x = Math.trunc(Math.random() * window.innerWidth + 1);
      const y = Math.trunc(Math.random() * window.innerHeight + 1);
      const radius = Number((Math.random() * 1.8).toFixed(2));
      stars.push({ x, y, radius });
    }

    function drawStar(x, y, radius) {
      const bgCtx = pageBackground.getContext('2d');
      bgCtx.beginPath();
      bgCtx.arc(x, y, radius, 0, Math.PI * 2, true);
      bgCtx.fillStyle = 'white';
      bgCtx.shadowColor = 'white';
      bgCtx.shadowBlur = 10;
      bgCtx.fill();
    }

    if (pageBackground.getContext) {
      const bgCtx = pageBackground.getContext('2d');
      bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach((elem) => {
        drawStar(elem.x, elem.y, elem.radius);
      });
    }
  }

  drawStarsBg();

  // The stars get distorted when you change the screen size after the background is drawn.
  // Of course regular users won't be dragging the browser's edge back and forth, and changing the page width, but just in case:

  window.matchMedia('(max-width: 469px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 470px) and (max-width: 767px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 768px) and (max-width: 979px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 980px) and (max-width: 1199px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 1200px) and (max-width: 1399px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 1400px) and (max-width: 1599px)').addEventListener('change', () => {
    drawStarsBg();
  });

  window.matchMedia('(min-width: 1600px)').addEventListener('change', () => {
    drawStarsBg();
  });
});
