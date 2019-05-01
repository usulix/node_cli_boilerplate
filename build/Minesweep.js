"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _readline = _interopRequireDefault(require("readline"));

var _Gameboard = _interopRequireDefault(require("./Gameboard.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  run: function run() {
    var _this = this;

    this.gamereadline = _readline["default"].createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.setupGame().then(function (result) {
      _this.game = result;

      _this.playgame().then(function (result) {
        _this.endgame(result);
      });
    });
  },
  setupGame: function setupGame() {
    var _this2 = this;

    return new Promise(function (resolve) {
      _this2.gamereadline.question("How many rows (max 26)? ", function (count) {
        //@todo check count is interger between 1 and 26
        console.log('creating ' + count + ' X ' + count + ' board');
        resolve(_Gameboard["default"].create(count));
      });
    });
  },
  playgame: function playgame() {
    var _this3 = this;

    return new Promise(function (resolve) {
      _this3.getColumn().then(function (result) {
        var col = result;

        _this3.getRow().then(function (result) {
          var row = result;

          _this3.game.turn(col, row).then(function (result) {
            if (result === 'play') {
              _this3.playgame();
            } else {
              _this3.endgame(result);
            }
          });
        });
      });
    });
  },
  getRow: function getRow() {
    var _this4 = this;

    return new Promise(function (resolve) {
      _this4.gamereadline.question("Which row ", function (row) {
        //@todo check row is 1-26
        resolve(parseInt(row));
      });
    });
  },
  getColumn: function getColumn() {
    var _this5 = this;

    return new Promise(function (resolve) {
      _this5.gamereadline.question("Which column ", function (col) {
        //@todo check col is 1-26
        resolve(col.toUpperCase());
      });
    });
  },
  endgame: function endgame(result) {
    console.log('You ' + result);
    this.gamereadline.close();
  }
};
exports["default"] = _default;