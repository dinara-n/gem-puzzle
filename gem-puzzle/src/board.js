/* eslint-disable max-len */
class Board {
  constructor(gameBoard, rowLength, gap) {
    this.gameBoard = gameBoard;
    this.rowLength = rowLength;
    this.boardLength = this.rowLength ** 2;
    this.boardSize = this.getBoardSize();
    this.gapSize = gap;
    this.tileSize = this.getTileSize();
    this.aimArray = Board.getAimArray(this.boardLength);
    this.array = Board.getShuffledArray(this.aimArray);
    this.tilesCoords = this.getTilesCoords();
    this.zeroIndex = this.getZeroIndex();
    this.movesNumber = 0;
    this.areTilesSwapping = false;
    this.tileToSwapIndex = null;
    this.tileTargetIndex = null;
    this.movingTilePrevCoords = null;
    this.movingTileNewCoords = null;
    this.tileMovingIndex = null;
  }

  static getAimArray(length) {
    const arr = [];
    for (let i = 0; i < length - 1; i += 1) {
      arr.push(i + 1);
    }
    arr.push(0);
    return arr;
  }

  static getShuffledArray(arr) {
    const newArr = Array.from(arr);
    do {
      for (let i = newArr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
    } while (!Board.isSolvable(newArr));

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
      return sum % 2 === 0;
    }
    sum += Math.trunc(arr.indexOf(0) / arrRowLength);
    return sum % 2 !== 0;
  }

  getZeroIndex() {
    let zeroIndex = null;
    this.array.forEach((elem, i) => {
      if (elem === 0) {
        zeroIndex = i;
      }
    });
    return zeroIndex;
  }

  getBoardSize() {
    return parseInt(window.getComputedStyle(this.gameBoard).getPropertyValue('width'), 10);
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

  swapTiles(targetIndex) {
    const adjacentIndexes = [targetIndex - 1, targetIndex + 1, targetIndex - this.rowLength, targetIndex + this.rowLength];
    if (this.array[targetIndex] === undefined) return;
    adjacentIndexes.forEach((elem) => {
      const isSameRow = Math.trunc(targetIndex / this.rowLength) === Math.trunc(elem / this.rowLength);
      const isSameColumn = targetIndex % this.rowLength === elem % this.rowLength;
      if ((isSameRow || isSameColumn) && this.array[elem] !== undefined && this.array[elem] === 0) {
        this.areTilesSwapping = true;
        this.tileToSwapIndex = targetIndex;
        this.tileTargetIndex = elem;
        this.movingTilePrevCoords = { ...this.tilesCoords[targetIndex] };
        this.movingTileNewCoords = { ...this.tilesCoords[elem] };
        [this.array[targetIndex], this.array[elem]] = [this.array[elem], this.array[targetIndex]];
        this.movesNumber += 1;
      }
    });
  }

  canTileMove(targetIndex) {
    const adjacentIndexes = [targetIndex - 1, targetIndex + 1, targetIndex - this.rowLength, targetIndex + this.rowLength];
    // if (this.array[targetIndex] === undefined) return;
    // eslint-disable-next-line no-restricted-syntax, prefer-const
    for (let elem of adjacentIndexes) {
      const isSameRow = Math.trunc(targetIndex / this.rowLength) === Math.trunc(elem / this.rowLength);
      const isSameColumn = targetIndex % this.rowLength === elem % this.rowLength;
      if ((isSameRow || isSameColumn) && this.array[elem] !== undefined && this.array[elem] === 0) {
        return true;
      }
    }
    return false;
  }

  recalculateStats() {
    this.boardSize = this.getBoardSize();
    this.tileSize = this.getTileSize();
    this.tilesCoords = this.getTilesCoords();
  }

  isSolved() {
    for (let i = 0; i < this.boardLength; i += 1) {
      if (this.array[i] !== this.aimArray[i]) {
        return false;
      }
    }
    return true;
  }
}

export default Board;
