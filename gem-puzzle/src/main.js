/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import './style.css';
import Board from './board';
import './assets/click.mp3';
import './assets/apple-icon-180x180.png';
import './assets/sound-icon-30x30.png';

const audioTileMoving = new Audio('./assets/click.mp3');
audioTileMoving.volume = 0.2;
audioTileMoving.muted = true;

const COLOR_BLACK = 'rgb(0, 0, 0)';
const COLOR_WHITE = 'rgb(255, 255, 255)';
// const COLOR_BLUE = 'rgb(69, 232, 247)';
const COLOR_YELLOW = 'rgb(247, 205, 9)';
// const COLOR_TRANSPARENT_YELLOW = 'rgba(247, 205, 9, 0.1)';
const COLOR_TRANSPARENT_BLUE = 'rgba(69, 232, 247, 0.1)';

document.addEventListener('DOMContentLoaded', () => {
  // Generating HTML

  function addHtmlElement(args) {
    const element = document.createElement(args.tag);
    Object.keys(args).forEach((key) => {
      switch (key) {
        case 'tag':
        case 'parent':
          break;
        case 'classList':
          args[key].forEach((elem) => element.classList.add(elem));
          break;
        default:
          element[key] = args[key];
      }
      // if (key === 'classList') {
      //   args.classList.forEach((elem) => element.classList.add(elem));
      // } else {
      //   element[key] = args[key];
      // }
    });
    args.parent.append(element);
    return element;
  }

  const mainContainer = addHtmlElement({ tag: 'main', parent: document.body, classList: ['main-container'] });
  const gameControls = addHtmlElement({ tag: 'section', parent: mainContainer, classList: ['game-controls'] });
  const sizeSelect = addHtmlElement({ tag: 'select', parent: gameControls, classList: ['game-controls__size'], name: 'board-size' });
  for (let size = 3; size <= 8; size += 1) {
    const sizeSelectOption = addHtmlElement({ tag: 'option', parent: sizeSelect, classList: ['game-controls__size-select'], textContent: `${size} x ${size}`, value: size });
  }
  sizeSelect.value = 4;
  const btnNew = addHtmlElement({ tag: 'button', parent: gameControls, classList: ['game-controls__btn', 'game-controls__btn--new'], textContent: 'New Game' });
  const btnSave = addHtmlElement({ tag: 'button', parent: gameControls, classList: ['game-controls__btn', 'game-controls__btn--save'], textContent: 'Save' });
  const btnSaved = addHtmlElement({ tag: 'button', parent: gameControls, classList: ['game-controls__btn', 'game-controls__btn--saved'], textContent: 'Saved Game' });
  const btnRecords = addHtmlElement({ tag: 'button', parent: gameControls, classList: ['game-controls__btn', 'game-controls__btn--records'], textContent: 'Records' });
  const btnSound = addHtmlElement({ tag: 'button', parent: gameControls, ariaLabel: 'Turn sound on or off', classList: ['game-controls__btn', 'game-controls__btn--sound'] });
  const gameInfo = addHtmlElement({ tag: 'section', parent: mainContainer, classList: ['game-info'] });
  const gameTime = addHtmlElement({ tag: 'p', parent: gameInfo, classList: ['game-info__time'] });
  const gameTimer = addHtmlElement({ tag: 'span', parent: gameTime, classList: ['game-info__timer'], textContent: '0:0' });
  const gameMoves = addHtmlElement({ tag: 'p', parent: gameInfo, classList: ['game-info__moves'], textContent: 'Moves: ' });
  const gameMovesNumber = addHtmlElement({ tag: 'span', parent: gameMoves, classList: ['game-info__moves-number'], textContent: '0' });
  const gameBoardWrapper = addHtmlElement({ tag: 'section', parent: mainContainer, classList: ['gameboard-wrapper'] });
  const gameBoard = addHtmlElement({ tag: 'canvas', parent: gameBoardWrapper, classList: ['gameboard'], textContent: 'Sorry! It seems your browser does not support HTML Canvas. Please try another browser.' });
  const gameCtx = gameBoard.getContext('2d');
  gameCtx.canvas.width = 500;
  gameCtx.canvas.height = 500;
  if (window.matchMedia('(max-width: 519px)').matches) {
    gameCtx.canvas.width = 300;
    gameCtx.canvas.height = 300;
  }
  // if (window.innerWidth < 520 || window.innerHeight < 520) { // need it
  //   gameCtx.canvas.width = 300;
  //   gameCtx.canvas.height = 300;
  // } else {
  //   gameCtx.canvas.width = 500;
  //   gameCtx.canvas.height = 500;
  // }
  const pageBackground = addHtmlElement({ tag: 'canvas', parent: document.body, classList: ['page-background'], height: window.innerHeight, width: window.innerWidth });

  window.addEventListener('resize', () => {
    gameCtx.canvas.width = (window.innerWidth < 520) ? 300 : 500;
    gameCtx.canvas.height = (window.innerWidth < 520) ? 300 : 500;
    // if (window.innerWidth < 520 || window.innerHeight < 520) { // need it
    //   gameCtx.canvas.width = 300;
    //   gameCtx.canvas.height = 300;
    // } else {
    //   gameCtx.canvas.width = 500;
    //   gameCtx.canvas.height = 500;
    // }
    board.recalculateStats();
    drawBoard();
  });

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

  const gameSettings = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameSettings')) || {};
  if (gameSettings.sound) {
    audioTileMoving.muted = false;
    btnSound.classList.add('sound-on');
  }

  // The Gameboard

  let board = new Board(gameBoard, +sizeSelect.value, 8);
  console.log(board);
  const offsetPerFrame = (board.tileSize + board.gapSize) / 50;
  let xShift = 0;
  let yShift = 0;
  let xDirection = null;
  let yDirection = null;
  let tileSwapComplete = false;
  let isTileDragged = false;
  let mouseX = 0;
  let mouseY = 0;
  let mouseXOffset = 0;
  let mouseYOffset = 0;
  let isBoardDrawn = true;
  console.log(gameCtx);

  function makeSquare(tile, xStart, xEnd, yStart, yEnd, curve) {
    tile.moveTo(xStart, yStart + curve);
    tile.quadraticCurveTo(xStart, yStart, xStart + curve, yStart);
    tile.lineTo(xEnd - curve, yStart);
    tile.quadraticCurveTo(xEnd, yStart, xEnd, yStart + curve);
    tile.lineTo(xEnd, yEnd - curve);
    tile.quadraticCurveTo(xEnd, yEnd, xEnd - curve, yEnd);
    tile.lineTo(xStart + curve, yEnd);
    tile.quadraticCurveTo(xStart, yEnd, xStart, yEnd - curve);
    tile.lineTo(xStart, yStart + curve);
  }

  function drawTile(ctx, elem, i) {
    let tileNumber = elem;
    let {
      xStart, xEnd, yStart, yEnd,
    } = { ...board.tilesCoords[i] };

    if (board.areTilesSwapping) {
      ctx.clearRect(board.movingTilePrevCoords.xStart - 2, board.movingTilePrevCoords.yStart - 2, board.tileSize + 4, board.tileSize + 4);
      tileNumber = board.array[board.tileTargetIndex];

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
        board.tileToSwapIndex = null;
        board.tileTargetIndex = null;
      } else {
        // If tile is still moving

        xShift = (xDirection === 'right') ? (xShift + offsetPerFrame) : (xDirection === 'left') ? (xShift - offsetPerFrame) : xShift;
        if (xDirection === 'right' || xDirection === 'left') {
          board.movingTilePrevCoords.xStart += xShift;
          // board.movingTilePrevCoords.xEnd += xShift;
          board.movingTilePrevCoords.xEnd = board.movingTilePrevCoords.xStart + board.tileSize;
          xStart = board.movingTilePrevCoords.xStart;
          // xEnd = board.movingTilePrevCoords.xEnd;
          xEnd = xStart + board.tileSize;
          yStart = board.movingTilePrevCoords.yStart;
          yEnd = board.movingTilePrevCoords.yEnd;
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
        board.tileToSwapIndex = null;
        board.tileTargetIndex = null;
      } else {
        // If tile is still moving

        yShift = (yDirection === 'down') ? (yShift + offsetPerFrame) : (yDirection === 'up') ? (yShift - offsetPerFrame) : yShift;
        if (yDirection === 'down' || yDirection === 'up') {
          board.movingTilePrevCoords.yStart += yShift;
          // board.movingTilePrevCoords.yEnd += yShift;
          board.movingTilePrevCoords.yEnd = board.movingTilePrevCoords.yStart + board.tileSize;
          yStart = board.movingTilePrevCoords.yStart;
          // yEnd = board.movingTilePrevCoords.yEnd;
          yEnd = yStart + board.tileSize;
          xStart = board.movingTilePrevCoords.xStart;
          xEnd = board.movingTilePrevCoords.xEnd;
        }
      }
    }

    if (isTileDragged && isBoardDrawn) {
      tileNumber = board.array[board.tileMovingIndex];
      xStart = mouseX - mouseXOffset;
      xEnd = xStart + board.tileSize;
      yStart = mouseY - mouseYOffset;
      yEnd = yStart + board.tileSize;
    }

    const tile = new Path2D();
    ctx.beginPath();
    makeSquare(tile, xStart, xEnd, yStart, yEnd, 5);
    ctx.lineWidth = '2';
    ctx.strokeStyle = COLOR_YELLOW;
    ctx.stroke(tile);
    ctx.fillStyle = COLOR_TRANSPARENT_BLUE;
    ctx.fill(tile);
    ctx.fillStyle = COLOR_YELLOW;
    ctx.font = `${board.tileSize * 0.5}px "Audiowide"`;
    ctx.textBaseline = 'middle';
    ctx.fillText(tileNumber, xStart + (board.tileSize - ctx.measureText(tileNumber).width) * 0.5, yStart + board.tileSize * 0.5);

    if (board.areTilesSwapping && !tileSwapComplete && isBoardDrawn) {
      // eslint-disable-next-line prefer-arrow-callback, func-names
      window.requestAnimationFrame(function () { drawTile(ctx, board.array[board.tileToSwapIndex], board.tileToSwapIndex); });
    }

    if (isTileDragged && isBoardDrawn) {
      isBoardDrawn = false;
    }
  }

  function drawBoard() {
    // if (gameBoard.getContext) {
    gameCtx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    board.array.forEach((elem, i) => {
      if (elem && (i !== board.tileMovingIndex)) {
        drawTile(gameCtx, elem, i);
      }
    });
    isBoardDrawn = true;
    // }
  }

  drawBoard();

  // Redraw the board a bit later in case the font hasn't been downloaded in time, and the board's been drawn with the default font

  setTimeout(() => {
    isBoardDrawn = false;
    drawBoard();
  }, 500);

  // Board Size Selection

  sizeSelect.addEventListener('change', () => {
    board = new Board(gameBoard, +sizeSelect.value, 8);
    drawBoard();
    board.movesNumber = 0;
    gameMovesNumber.textContent = board.movesNumber;
    console.log(board);
    clearInterval(iterateTime);
    // stopIteratingTime();
    startingTime = Math.trunc(Date.now() / 1000);
    setInterval(iterateTime, 100);
    // iterateTime();
    gameTime.style.color = COLOR_WHITE;
    gameMoves.style.color = COLOR_WHITE;
    btnSave.disabled = false;
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // New Game button

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
    gameTime.style.color = COLOR_WHITE;
    gameMoves.style.color = COLOR_WHITE;
    btnSave.disabled = false;
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // Save button

  btnSave.addEventListener('click', () => {
    const gameStats = {};
    gameStats.size = sizeSelect.value;
    gameStats.timer = gameTimer.textContent;
    gameStats.moves = gameMovesNumber.textContent;
    gameStats.array = board.array.slice();
    gameStats.zIndex = board.zIndex;
    localStorage.setItem('gemPuzzleByDinaraN_gameStats', JSON.stringify(gameStats));
    btnSaved.disabled = false;
  });

  // Saved Game button

  if (!localStorage.getItem('gemPuzzleByDinaraN_gameStats')) {
    btnSaved.disabled = true;
  }

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
    gameTime.style.color = COLOR_WHITE;
    gameMoves.style.color = COLOR_WHITE;
    btnSave.disabled = false;
    gameBoard.addEventListener('mousedown', boardMouseDown);
  });

  // Sound button

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

  // Records button

  const gameRecords = JSON.parse(localStorage.getItem('gemPuzzleByDinaraN_gameRecords')) || [];

  btnRecords.addEventListener('click', () => {
    clearInterval(iterateTime);
    // stopIteratingTime();
    const gameRecordsPopUp = addHtmlElement({ tag: 'div', parent: document.body, classList: ['game-records-popup'] });
    if (gameRecords.length === 0) {
      const gameRecordsMessage = addHtmlElement({ tag: 'h2', parent: gameRecordsPopUp, classList: ['game-records-message'], textContent: 'You have not won any games yet!' });
    } else {
      const gameRecordsTable = addHtmlElement({ tag: 'table', parent: gameRecordsPopUp, classList: ['game-records-table'] });
      const gameRecordsTableHeader = addHtmlElement({ tag: 'tr', parent: gameRecordsTable, classList: ['game-records-table__header'] });
      const gameRecordsTableHeaderNo = addHtmlElement({ tag: 'th', parent: gameRecordsTableHeader, classList: ['game-records-table__header-cell'], textContent: 'Place' });
      const gameRecordsTableHeaderTime = addHtmlElement({ tag: 'th', parent: gameRecordsTableHeader, classList: ['game-records-table__header-cell'], textContent: 'Time' });
      const gameRecordsTableHeaderMoves = addHtmlElement({ tag: 'th', parent: gameRecordsTableHeader, classList: ['game-records-table__header-cell'], textContent: 'Moves' });
      gameRecords.forEach((elem, i) => {
        const gameRecordsTableRow = addHtmlElement({ tag: 'tr', parent: gameRecordsTable, classList: ['game-records-table__row'] });
        const gameRecordsTableRowNo = addHtmlElement({ tag: 'td', parent: gameRecordsTableRow, classList: ['game-records-table__row-cell'], textContent: i + 1 });
        const gameRecordsTableRowTime = addHtmlElement({ tag: 'td', parent: gameRecordsTableRow, classList: ['game-records-table__row-cell'], textContent: elem.time });
        const gameRecordsTableRowMoves = addHtmlElement({ tag: 'td', parent: gameRecordsTableRow, classList: ['game-records-table__row-cell'], textContent: elem.moves });
      });
    }

    gameRecordsPopUp.addEventListener('click', () => {
      // setInterval(iterateTime, 100);
      // iterateTime();
      gameRecordsPopUp.remove();
    });
    window.addEventListener('keydown', (keyDown) => {
      gameRecordsPopUp.remove();
    });
  });

  // If the game is won

  function showWinningMessage() {
    const gameSolvedPopUp = addHtmlElement({ tag: 'div', parent: document.body, classList: ['game-solved-popup'] });
    const gameSolvedPopUpMessage = addHtmlElement({ tag: 'h2', parent: gameSolvedPopUp, classList: ['game-solved-popup__message'], textContent: `Hooray! You solved the puzzle in ${gameTimer.textContent} and ${board.movesNumber} moves!` });
    gameSolvedPopUp.addEventListener('click', () => {
      gameSolvedPopUp.remove();
    });
    window.addEventListener('keydown', (keyDown) => {
      gameSolvedPopUp.remove();
    });
  }

  function updateRecords() {
    const time = gameTimer.textContent;
    const moves = board.movesNumber;
    gameRecords.push({ time, moves });
    gameRecords.sort((a, b) => a.moves - b.moves);
    gameRecords.length = (gameRecords.length > 10) ? 10 : gameRecords.length;
    // console.log(gameRecords);
    localStorage.setItem('gemPuzzleByDinaraN_gameRecords', JSON.stringify(gameRecords));
  }

  function finishGame() {
    gameBoard.removeEventListener('mousedown', boardMouseDown);
    // console.log('Solved!');
    clearInterval(iterateTime);
    // stopIteratingTime();
    gameTime.style.color = COLOR_BLACK;
    gameMoves.style.color = COLOR_BLACK;
    btnSave.disabled = true;
    showWinningMessage();
    if ((gameRecords.at(-1) && board.movesNumber < +gameRecords.at(-1).moves) || gameRecords.length < 10) {
      updateRecords();
    }
  }

  // When mouse button is pressed down

  function boardMouseDown(evt) {
    console.log('mouse down');
    const bounding = gameBoard.getBoundingClientRect();
    mouseX = evt.clientX - bounding.left;
    mouseY = evt.clientY - bounding.top;

    gameBoard.addEventListener('mousemove', boardDrag);
    gameBoard.addEventListener('mouseup', boardMouseClick);
  }

  gameBoard.addEventListener('mousedown', boardMouseDown);

  // Dragging the tile

  function boardDrag(evt) {
    console.log('mouse move');
    evt.preventDefault();
    gameBoard.removeEventListener('mouseup', boardMouseClick);
    // gameBoard.removeEventListener('mousemove', boardDrag);
    document.body.addEventListener('mouseup', boardStopDrag);
    // gameBoard.addEventListener('mouseleave', () => {
    //   boardStopDrag();
    // });

    if (isTileDragged) {
      const bounding = gameBoard.getBoundingClientRect();
      mouseX = evt.clientX - bounding.left;
      mouseY = evt.clientY - bounding.top;
      drawBoard();
      drawTile(gameCtx, board.array[board.tileMovingIndex], board.tileMovingIndex);
    }
    if (!isTileDragged) {
      for (let i = 0; i < board.boardLength; i += 1) {
        const elem = board.tilesCoords[i];
        if ((mouseX >= elem.xStart) && (mouseX <= elem.xEnd) && (mouseY >= elem.yStart) && (mouseY <= elem.yEnd) && board.canTileMove(i)) {
          mouseXOffset = mouseX - elem.xStart;
          mouseYOffset = mouseY - elem.yStart;
          isTileDragged = true;
          board.tileMovingIndex = i;
          break;
        }
      }
    }
  }

  function boardStopDrag() {
    console.log('stop mouse move');
    gameBoard.removeEventListener('mousemove', boardDrag);
    document.body.removeEventListener('mouseup', boardStopDrag);
    // gameBoard.removeEventListener('mouseup', boardMouseClick);
    const zeroCoords = board.tilesCoords[board.zeroIndex];
    if (isTileDragged && (mouseX >= zeroCoords.xStart) && (mouseX <= zeroCoords.xEnd) && (mouseY >= zeroCoords.yStart) && (mouseY <= zeroCoords.yEnd)) {
      // const coords = board.tilesCoords;
      [board.array[board.tileMovingIndex], board.array[board.zeroIndex]] = [board.array[board.zeroIndex], board.array[board.tileMovingIndex]];
      board.zeroIndex = board.tileMovingIndex;
      board.movesNumber += 1;
      gameMovesNumber.textContent = board.movesNumber;
      audioTileMoving.play();

      if (board.isSolved()) {
        finishGame();
      }
    }
    isTileDragged = false;
    board.tileMovingIndex = null;
    mouseX = 0;
    mouseY = 0;
    mouseXOffset = 0;
    mouseYOffset = 0;
    isBoardDrawn = false;
    drawBoard();
  }

  // Moving the tile on click

  function boardMouseClick(evt) {
    console.log('mouse click');
    gameBoard.removeEventListener('mousemove', boardDrag);
    gameBoard.removeEventListener('mouseup', boardMouseClick);
    // gameBoard.removeEventListener('mouseup', boardStopDrag);
    const bounding = gameBoard.getBoundingClientRect();
    const x = evt.clientX - bounding.left;
    const y = evt.clientY - bounding.top;
    for (let i = 0; i < board.boardLength; i += 1) {
      const elem = board.tilesCoords[i];
      if ((x >= elem.xStart) && (x <= elem.xEnd) && (y >= elem.yStart) && (y <= elem.yEnd)) {
        board.swapTiles(i);
        if (board.areTilesSwapping) {
          audioTileMoving.play();
          xDirection = (board.movingTileNewCoords.xStart > board.movingTilePrevCoords.xStart) ? 'right' : (board.movingTileNewCoords.xStart < board.movingTilePrevCoords.xStart) ? 'left' : null;
          yDirection = (board.movingTileNewCoords.yStart > board.movingTilePrevCoords.yStart) ? 'down' : (board.movingTileNewCoords.yStart < board.movingTilePrevCoords.yStart) ? 'up' : null;
          tileSwapComplete = false;
          // eslint-disable-next-line prefer-arrow-callback, func-names, no-loop-func
          window.requestAnimationFrame(function () { drawTile(gameCtx, board.array[board.tileToSwapIndex], board.tileToSwapIndex); });
          board.zeroIndex = i;
          gameMovesNumber.textContent = board.movesNumber;
        }
        break;
      }
    }
    if (board.isSolved()) {
      finishGame();
    }
  }

  // Page background - Stars

  function drawStarsBg() {
    function getStars() {
      const starsNumber = Math.trunc(window.innerWidth * window.innerHeight * 0.001) + Math.trunc(Math.random() * 100);
      // console.log(`Stars number: ${starsNumber}`);
      const stars = [];
      for (let i = 0; i < starsNumber; i += 1) {
        const x = Math.trunc(Math.random() * window.innerWidth + 1);
        const y = Math.trunc(Math.random() * window.innerHeight + 1);
        const radius = Number((Math.random() * 1.8).toFixed(2));
        stars.push({ x, y, radius });
      }
      return stars;
    }

    function drawStar(bgCtx, x, y, radius) {
      // const bgCtx = pageBackground.getContext('2d');
      bgCtx.beginPath();
      bgCtx.arc(x, y, radius, 0, Math.PI * 2, true);
      bgCtx.fillStyle = COLOR_WHITE;
      bgCtx.shadowColor = COLOR_WHITE;
      bgCtx.shadowBlur = 10;
      bgCtx.fill();
    }

    // if (pageBackground.getContext) {
    const bgCtx = pageBackground.getContext('2d');
    bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const stars = getStars();
    stars.forEach((elem) => {
      drawStar(bgCtx, elem.x, elem.y, elem.radius);
    });
    // }
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
