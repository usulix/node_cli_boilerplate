export default {
  create(count) {
    this.keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    this.board = []
    this.mines = []
    for(let x = 0; x < count; x++) {
      this.board.push(this.newRow(count))
      this.mines.push(this.newMineRow(count))
    }
    console.table(this.board)
    return this
  },
  turn(col, row) {
    return new Promise(resolve => {
      const spot = this.mines[row][col]
      if( spot === 0) {
        this.board[row][col] = '*'
        console.table(this.board)
        resolve('Lose')
        return
      }
      this.queueCell({row: row, col: col})
      this.updateConnected()
      console.table(this.board)
      resolve('play')
    })
  },
  newRow(count) {
    let row = {}
    for (let x = 0; x < count; x++) {
      row[this.keys[x]] = '?'
    }
    return row
  },
  newMineRow(count) {
    let row = {}
    for (let x = 0; x < count; x++) {
      row[this.keys[x]] = Math.round(Math.random() + .25)
    }
    return row
  },
  queueCell(obj) {
    this.cellQueue = this.cellQueue || []
    for(let x = 0; x < this.cellQueue.length; x++) {
      if(this.cellQueue[x].row === obj.row && this.cellQueue[x].col === obj.col){
        return
      }
    }
    this.cellQueue.push(obj)
  },
  updateConnected() {
    const cell = this.cellQueue.pop()
    const rowBefore = parseInt(cell.row) - 1
    const rowAfter = parseInt(cell.row) + 1
    const colBefore = this.keys[this.keys.indexOf(cell.col) - 1]
    const colAfter = this.keys[this.keys.indexOf(cell.col) + 1]
    let cellValue = 0
    cellValue += this.checkRow(rowBefore,[colBefore, cell.col, colAfter])
    cellValue += this.checkRow(cell.row,[colBefore, colAfter])
    cellValue += this.checkRow(rowAfter,[colBefore, cell.col, colAfter])
    this.board[cell.row][cell.col] = cellValue
    if(cellValue > 0) {
      return
    }
    this.queueRow(rowBefore,[colBefore, cell.col, colAfter])
    this.queueRow(cell.row,[colBefore, colAfter])
    this.queueRow(rowAfter,[colBefore, cell.col, colAfter])
    while(this.cellQueue.length > 0) {
      this.updateConnected()
    }
  },
  checkRow(row, arrCols) {
    if(!this.mines.hasOwnProperty(row)) {
      return 0
    }
    let count = 0
    arrCols.forEach(col => {
      if(this.mines[row][col] === 0) {
        count += 1
      }
    })
    return count
  },
  queueRow(row, arrCols) {
    if(!this.board.hasOwnProperty(row)) {
      return
    }
    arrCols.forEach(col => {
      if(!this.board[row][col]) {
        return
      }
      this.queueCell({row: row, col: col})
    })
  }
}