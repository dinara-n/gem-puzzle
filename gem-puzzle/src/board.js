/* eslint-disable max-len */
class Board {
  constructor(gameBoard, rowLength, gap) {
    this.gameBoard = gameBoard;
    this.rowLength = rowLength;
    this.boardLength = this.rowLength ** 2;
    this.boardSize = this.getBoardSize();
    // this.boardSize = 300;
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
    // this.mouseCoords = { x: null, y: null };
    this.zeroIndex = this.getZeroIndex();
    this.movesNumber = 0;
    this.areTilesSwapping = false;
    this.tileToSwap = null;
    this.tileTarget = null;
    this.movingTilePrevCoords = null;
    this.movingTileNewCoords = null;
    this.tileMovingIndex = null;
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

  swapTiles(target) {
    const indexes = [target - 1, target + 1, target - this.rowLength, target + this.rowLength];
    // console.log(target);
    // console.log(indexes);
    if (this.array[target] === undefined) return;
    indexes.forEach((elem) => {
      // console.log(target, elem);
      const isSameRow = Math.trunc(target / this.rowLength) === Math.trunc(elem / this.rowLength);
      const isSameColumn = target % this.rowLength === elem % this.rowLength;
      if ((isSameRow || isSameColumn) && this.array[elem] !== undefined && this.array[elem] === 0) {
        console.log('!!!!!!!');
        this.areTilesSwapping = true;
        this.tileToSwap = target;
        this.tileTarget = elem;
        this.movingTilePrevCoords = { ...this.tilesCoords[target] };
        this.movingTileNewCoords = { ...this.tilesCoords[elem] };
        console.log(this.movingTilePrevCoords, this.movingTileNewCoords);
        [this.array[target], this.array[elem]] = [this.array[elem], this.array[target]];
        this.movesNumber += 1;
      }
    });
  }

  checkTileCanMove(targetIndex) {
    const indexes = [targetIndex - 1, targetIndex + 1, targetIndex - this.rowLength, targetIndex + this.rowLength];
    // if (this.array[targetIndex] === undefined) return;
    // eslint-disable-next-line no-restricted-syntax, prefer-const
    for (let elem of indexes) {
      const isSameRow = Math.trunc(targetIndex / this.rowLength) === Math.trunc(elem / this.rowLength);
      const isSameColumn = targetIndex % this.rowLength === elem % this.rowLength;
      if ((isSameRow || isSameColumn) && this.array[elem] !== undefined && this.array[elem] === 0) {
        return true;
      }
    }
    return false;
  }

  recalculateStats() {
    // this.rowLength = rowLength;
    // this.boardLength = this.rowLength ** 2;
    this.boardSize = this.getBoardSize();
    // this.boardSize = 300;
    this.tileSize = this.getTileSize();
    // this.aimArray = [];
    // for (let i = 0; i < this.boardLength; i += 1) {
    //   if (i !== this.boardLength - 1) {
    //     this.aimArray.push(i + 1);
    //   } else {
    //     this.aimArray.push(0);
    //   }
    // }
    // do {
    //   this.array = Board.getShuffledArray(this.aimArray);
    // } while (!Board.isSolvable(this.array));
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
