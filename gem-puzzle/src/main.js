/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import './style.css';
import Board from './board';
import './assets/tile-move.mp3';
import './assets/apple-icon-180x180.png';

const audioTileMoving = new Audio('./assets/tile-move.mp3');
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
  const sizeLabel = addHtmlElement('label', 'Size:', gameControls, 'game-controls__size-label');
  sizeLabel.htmlFor = 'board-size';
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
  const btnSound = addHtmlElement('button', 'Sound', gameControls, 'game-controls__btn');
  btnSound.classList.add('game-controls__btn--sound');
  const btnRecords = addHtmlElement('button', 'Records', gameControls, 'game-controls__btn');
  btnRecords.classList.add('game-controls__btn--records');
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

  // showTime();

  let board = new Board(gameBoard, +sizeSelect.value, 5);
  console.log(board);
  const gameBoardTiles = [];

  function drawTile(tile, xStart, xEnd, yStart, yEnd, curve, text) {
    tile.moveTo(xStart, yStart + curve);
    tile.quadraticCurveTo(xStart, yStart, xStart + curve, yStart);
    tile.lineTo(xEnd - curve, yStart);
    tile.quadraticCurveTo(xEnd, yStart, xEnd, yStart + curve);
    tile.lineTo(xEnd, yEnd - curve);
    tile.quadraticCurveTo(xEnd, yEnd, xEnd - curve, yEnd);
    tile.lineTo(xStart + curve, yEnd);
    tile.quadraticCurveTo(xStart, yEnd, xStart, yEnd - curve);
    // tile.fillText(text, 20, 20);
  }

  function drawBoard() {
    if (gameBoard.getContext) {
      const ctx = gameBoard.getContext('2d');
      ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
      gameBoardTiles.length = 0;
      board.array.forEach((elem, i) => {
        if (elem) {
          const tile = new Path2D();
          // ctx.shadowOffsetX = 2;
          // ctx.shadowOffsetY = 2;
          // ctx.shadowBlur = 2;
          // ctx.shadowColor = 'rgb(30, 30, 30)';
          ctx.beginPath();
          drawTile(tile, board.tilesCoords[i].xStart, board.tilesCoords[i].xEnd, board.tilesCoords[i].yStart, board.tilesCoords[i].yEnd, 5, elem);
          ctx.fillStyle = 'orange';
          ctx.fill(tile);
          ctx.fillStyle = 'beige';
          ctx.font = '2em Arial';
          ctx.fillText(elem, board.tilesCoords[i].xStart + 20, board.tilesCoords[i].yStart + 40);
          gameBoardTiles.push(tile);
        } else {
          gameBoardTiles.push(null);
        }
      });
      // console.log(gameBoardTiles);
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

  sizeSelect.addEventListener('change', () => {
    board = new Board(gameBoard, +sizeSelect.value, 5);
    drawBoard();
    board.movesNumber = 0;
    gameMovesNumber.textContent = board.movesNumber;
    console.log(board);
    clearInterval(iterateTime);
    startingTime = Math.trunc(Date.now() / 1000);
    setInterval(iterateTime, 100);
  });

  btnNew.addEventListener('click', () => {
    board = new Board(gameBoard, +sizeSelect.value, 5);
    drawBoard();
    board.movesNumber = 0;
    gameMovesNumber.textContent = board.movesNumber;
    clearInterval(iterateTime);
    startingTime = Math.trunc(Date.now() / 1000);
    setInterval(iterateTime, 100);
  });

  btnSave.addEventListener('click', () => {
    const gameStats = {};
    gameStats.size = sizeSelect.value;
    gameStats.timer = gameTimer.textContent;
    gameStats.moves = gameMovesNumber.textContent;
    gameStats.array = board.array.slice();
    localStorage.setItem('gemPuzzleByDinaraN_gameStats', JSON.stringify(gameStats));
  });

  btnSaved.addEventListener('click', () => {
    const gameStats = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameStats'));
    sizeSelect.value = gameStats.size;
    clearInterval(iterateTime);
    const savedTime = +gameStats.timer.split(':')[0] * 60 + +gameStats.timer.split(':')[1];
    startingTime = Math.trunc(Date.now() / 1000) - savedTime;
    setInterval(iterateTime, 100);
    board = new Board(gameBoard, +sizeSelect.value, 5);
    board.array = gameStats.array.slice();
    board.movesNumber = +gameStats.moves;
    gameMovesNumber.textContent = board.movesNumber;
    drawBoard();
  });

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

  btnRecords.addEventListener('click', () => {
    // clearInterval(iterateTime);
    const gameRecordsPopUp = addHtmlElement('div', null, document.body, 'game-records-popup');
    const gameRecordsTable = addHtmlElement('table', null, gameRecordsPopUp, 'game-records-table');
    const gameRecordsTableHeader = addHtmlElement('th', null, gameRecordsTable, 'game-records-table__header');
    const gameRecordsTableHeaderNo = addHtmlElement('td', 'Place', gameRecordsTableHeader, 'game-records-table__header-cell');
    const gameRecordsTableHeaderTime = addHtmlElement('td', 'Time', gameRecordsTableHeader, 'game-records-table__header-cell');
    const gameRecordsTableHeaderMoves = addHtmlElement('td', 'Moves', gameRecordsTableHeader, 'game-records-table__header-cell');
    gameRecords.forEach((elem, i) => {
      const gameRecordsTableRow = addHtmlElement('tr', null, gameRecordsTable, 'game-records-table__row');
      const gameRecordsTableRowNo = addHtmlElement('td', i + 1, gameRecordsTableRow, 'game-records-table__row-cell');
      const gameRecordsTableRowTime = addHtmlElement('td', elem.time, gameRecordsTableRow, 'game-records-table__row-cell');
      const gameRecordsTableRowMoves = addHtmlElement('td', elem.moves, gameRecordsTableRow, 'game-records-table__row-cell');
    });

    gameRecordsPopUp.addEventListener('click', () => {
      // setInterval(iterateTime, 100);
      gameRecordsPopUp.remove();
    });
  });

  function boardDrag(evt) {
    evt.preventDefault();
    gameBoard.removeEventListener('mouseup', boardMouseUp);
    gameBoard.removeEventListener('mousemove', boardDrag);
    console.log('mousemove');
  }

  function boardMouseDown() {
    gameBoard.addEventListener('mousemove', boardDrag);
    gameBoard.addEventListener('mouseup', boardMouseUp);
  }

  function boardMouseUp(evt) {
    gameBoard.removeEventListener('mousemove', boardDrag);
    gameBoard.removeEventListener('mouseup', boardMouseUp);
    console.log('click');
    const bounding = gameBoard.getBoundingClientRect();
    const x = evt.clientX - bounding.left;
    const y = evt.clientY - bounding.top;
    // console.log(x, y);
    for (let i = 0; i < board.boardLength; i += 1) {
      const elem = board.tilesCoords[i];
      // console.log(elem.xStart);
      if ((x >= elem.xStart) && (x <= elem.xEnd) && (y >= elem.yStart) && (y <= elem.yEnd)) {
        // console.log(board.array.join(', '));
        audioTileMoving.play();
        board.swapTiles(i);
        // console.log(board.array.join(', '));
        drawBoard();
        // board.movesNumber += 1;
        gameMovesNumber.textContent = board.movesNumber;
        break;
      }
    }
    if (board.isSolved()) {
      console.log('Solved!');
      clearInterval(iterateTime);
      if ((board.movesNumber < +gameRecords.at(-1).moves) || gameRecords.length < 10) {
        const time = gameTimer.textContent;
        const moves = board.movesNumber;
        gameRecords.push({ time, moves });
        gameRecords.sort((a, b) => a.moves - b.moves);
        gameRecords.length = (gameRecords.length > 10) ? 10 : gameRecords.length;
        console.log(gameRecords);
        localStorage.setItem('gemPuzzleByDinaraN_gameRecords', JSON.stringify(gameRecords));
      }
    }
  }

  gameBoard.addEventListener('mousedown', boardMouseDown);

  // const rowLength = 4;
  // const boardLength = rowLength ** 2;

  // function printA(a) {
  //   for (let i = 0; i < boardLength; i += rowLength) {
  //     console.log(a[i + 0], a[i + 1], a[i + 2], a[i + 3]);
  //   }
  // }

  // printA(finArray);
  // console.log(isSolvable(finArray));
  // shuffleArray(finArray);
  // printA(finArray);
  // console.log(isSolvable(finArray));

  // document.addEventListener('onbeforeunload', () => {

  // });
});
