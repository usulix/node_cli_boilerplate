import readline from 'readline'
import board from './Gameboard.js'

export default {
  run() {
    this.gamereadline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    this.setupGame()
      .then(result => {
        this.game = result
        this.playgame()
          .then(result => {
            this.endgame(result)
          })
      })
  },
  setupGame() {
    return new Promise((resolve) => {
      this.gamereadline.question(`How many rows (max 26)? `, count => {
        //@todo check count is interger between 1 and 26
        console.log('creating ' + count + ' X '
          + count + ' board')
        resolve (board.create(count))    
      })
    })
  },
  playgame() {
    return new Promise((resolve) => {
      this.getColumn().then(result => {
        let col = result
        this.getRow().then(result => {
          let row = result
          this.game.turn(col, row).then(result => {
            if (result === 'play') {
              this.playgame()
            } else {
              this.endgame(result)
            }
          })
        })
      })
    })
  },
  getRow() {
    return new Promise((resolve) => {
      this.gamereadline.question(`Which row `, row => {
        //@todo check row is 1-26
        resolve(parseInt(row))
      })
    })
  },
  getColumn() {
    return new Promise((resolve) => {
      this.gamereadline.question(`Which column `, col => {
        //@todo check col is 1-26
       resolve(col.toUpperCase())
      })
    })
  },
  endgame(result) {
    console.log('You ' + result)
    this.gamereadline.close()
  }
}