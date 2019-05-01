"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  create: function create(count) {
    this.keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.board = [];
    this.mines = [];

    for (var x = 0; x < count; x++) {
      this.board.push(this.newRow(count));
      this.mines.push(this.newMineRow(count));
    }

    console.table(this.board);
    return this;
  },
  turn: function turn(col, row) {
    var _this = this;

    return new Promise(function (resolve) {
      var spot = _this.mines[row][col];

      if (spot === 0) {
        _this.board[row][col] = '*';
        console.table(_this.board);
        resolve('Lose');
        return;
      }

      _this.queueCell({
        row: row,
        col: col
      });

      _this.updateConnected();

      console.table(_this.board);
      resolve('play');
    });
  },
  newRow: function newRow(count) {
    var row = {};

    for (var x = 0; x < count; x++) {
      row[this.keys[x]] = '?';
    }

    return row;
  },
  newMineRow: function newMineRow(count) {
    var row = {};

    for (var x = 0; x < count; x++) {
      row[this.keys[x]] = Math.round(Math.random() + .25);
    }

    return row;
  },
  queueCell: function queueCell(obj) {
    this.cellQueue = this.cellQueue || [];

    for (var x = 0; x < this.cellQueue.length; x++) {
      if (this.cellQueue[x].row === obj.row && this.cellQueue[x].col === obj.col) {
        return;
      }
    }

    this.cellQueue.push(obj);
  },
  updateConnected: function updateConnected() {
    var cell = this.cellQueue.pop();
    var rowBefore = parseInt(cell.row) - 1;
    var rowAfter = parseInt(cell.row) + 1;
    var colBefore = this.keys[this.keys.indexOf(cell.col) - 1];
    var colAfter = this.keys[this.keys.indexOf(cell.col) + 1];
    var cellValue = 0;
    cellValue += this.checkRow(rowBefore, [colBefore, cell.col, colAfter]);
    cellValue += this.checkRow(cell.row, [colBefore, colAfter]);
    cellValue += this.checkRow(rowAfter, [colBefore, cell.col, colAfter]);
    this.board[cell.row][cell.col] = cellValue;

    if (cellValue > 0) {
      return;
    }

    this.queueRow(rowBefore, [colBefore, cell.col, colAfter]);
    this.queueRow(cell.row, [colBefore, colAfter]);
    this.queueRow(rowAfter, [colBefore, cell.col, colAfter]);

    while (this.cellQueue.length > 0) {
      this.updateConnected();
    }
  },
  checkRow: function checkRow(row, arrCols) {
    var _this2 = this;

    if (!this.mines.hasOwnProperty(row)) {
      return 0;
    }

    var count = 0;
    arrCols.forEach(function (col) {
      if (_this2.mines[row][col] === 0) {
        count += 1;
      }
    });
    return count;
  },
  queueRow: function queueRow(row, arrCols) {
    var _this3 = this;

    if (!this.board.hasOwnProperty(row)) {
      return;
    }

    arrCols.forEach(function (col) {
      if (!_this3.board[row][col]) {
        return;
      }

      _this3.queueCell({
        row: row,
        col: col
      });
    });
  }
};
exports["default"] = _default;