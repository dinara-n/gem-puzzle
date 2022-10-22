/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import './style.css';

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
  btnNew.classList.add('game-controls__btn--save');
  const btnSaved = addHtmlElement('button', 'Saved Game', gameControls, 'game-controls__btn');
  btnNew.classList.add('game-controls__btn--saved');
  const btnSound = addHtmlElement('button', 'Sound on', gameControls, 'game-controls__btn');
  btnNew.classList.add('game-controls__btn--sound');
  const btnWinners = addHtmlElement('button', 'Winners', gameControls, 'game-controls__btn');
  btnNew.classList.add('game-controls__btn--winners');
  const gameInfo = addHtmlElement('section', null, mainContainer, 'game-info');
  const gameTime = addHtmlElement('p', 'Time: ', gameInfo, 'game-info__time');
  const gameTimer = addHtmlElement('span', '0:0', gameTime, 'game-info__timer');
  const gameMoves = addHtmlElement('p', 'Moves: ', gameInfo, 'game-info__moves');
  const gameMovesNumber = addHtmlElement('span', '0', gameMoves, 'game-info__moves-number');
  const gameBoardWrapper = addHtmlElement('section', null, mainContainer, 'gameboard-wrapper');
  const gameBoard = addHtmlElement('canvas', null, gameBoardWrapper, 'gameboard');
  // console.log(parseInt(window.getComputedStyle(gameBoard).getPropertyValue('width'), 10));

  class Board {
    constructor(rowLength, gap) {
      this.rowLength = rowLength;
      this.boardLength = this.rowLength ** 2;
      this.boardSize = Board.getBoardSize();
      this.gapSize = gap;
      this.tileSize = this.getTileSize();
      this.aimArray = [];
      for (let i = 0; i < this.boardLength; i += 1) {
        if (i !== this.boardLength - 1) {
          this.aimArray.push(i + 1);
        } else {
          this.aimArray.push(0);
        }
      }
      do {
        this.array = Board.getShuffledArray(this.aimArray);
      } while (!Board.isSolvable(this.array));
      this.tilesCoords = this.getTilesCoords();
    }

    static getShuffledArray(arr) {
      const newArr = Array.from(arr);
      for (let i = newArr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    }

    static isSolvable(arr) {
      const arrRowLength = Math.sqrt(arr.length);
      let sum = 0;
      for (let i = 0; i < arr.length - 1; i += 1) {
        for (let j = i + 1; j < arr.length; j += 1) {
          if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
            sum += 1;
          }
        }
      }
      if (arrRowLength % 2) {
        // console.log(sum);
        return sum % 2 === 0;
      }
      sum += Math.trunc(arr.indexOf(0) / arrRowLength);
      // console.log(sum);
      return sum % 2 !== 0;
    }

    static getBoardSize() {
      return parseInt(window.getComputedStyle(gameBoard).getPropertyValue('width'), 10);
    }

    getTileSize() {
      return Math.floor((this.boardSize - this.gapSize * (this.rowLength + 1)) / this.rowLength);
    }

    getTilesCoords() {
      const arr = [];
      this.array.forEach((elem, i) => {
        const columnNumber = i % this.rowLength;
        const xStart = this.gapSize + columnNumber * (this.tileSize + this.gapSize);
        const xEnd = xStart + this.tileSize;
        const rowNumber = Math.trunc(i / this.rowLength);
        const yStart = this.gapSize + rowNumber * (this.tileSize + this.gapSize);
        const yEnd = yStart + this.tileSize;
        arr.push({
          xStart, xEnd, yStart, yEnd,
        });
      });
      return arr;
    }

    swapTiles(target) {
      // const tiles = [this.array[target - 1], this.array[target + 1], this.array[target - this.rowLength], this.array[target + this.rowLength]];
      // console.log(tiles);
      // tiles.forEach((elem) => {
      //   console.log(target, elem);
      //   if (elem !== undefined && elem === 0) {
      //     console.log(this.array);
      //     [target, elem] = [elem, target];
      //   }
      // });
      const indexes = [target - 1, target + 1, target - this.rowLength, target + this.rowLength];
      if (this.array[target] === undefined) return;
      indexes.forEach((elem) => {
        // console.log(target, elem);
        if (this.array[elem] !== undefined && this.array[elem] === 0) {
          // console.log(this.array);
          [this.array[target], this.array[elem]] = [this.array[elem], this.array[target]];
        }
      });
    }
  }

  let board = new Board(+sizeSelect.value, 10);
  console.log(board);
  // console.log(board.array.indexOf(0));
  // console.log(board.array[board.array.indexOf(0) - 1]);
  // board.swapTiles(board.array.indexOf(0) - 1);
  // console.log(board);

  sizeSelect.addEventListener('change', () => {
    board = new Board(+sizeSelect.value, 10);
    console.log(board);
  });

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
});
