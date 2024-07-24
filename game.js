const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')

const mapBlocks = 20
const FPS = 10

window.onload = () => {
  const game = new Game(mapBlocks)
  game.drawMap()
  game.init()
}

class Game {
  constructor(mapBlocks) {
    this.mapBlocks = mapBlocks
    this.mapBlocksSize = Math.floor(canvas.width / mapBlocks)
  }

  drawMap() {
    for (let x = 0; x < this.mapBlocks; x++) {
      for (let y = 0; y < this.mapBlocks; y++) {
        canvasContext.strokeStyle = '#ddd'
        canvasContext.strokeRect(x * this.mapBlocksSize, y * this.mapBlocksSize, this.mapBlocksSize, this.mapBlocksSize)
      }
    }
  }

  init() {
    const food = new Food(this.mapBlocksSize)
    const snake = new Snake(this.mapBlocksSize)

    setInterval(() => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      this.drawMap()
      food.move()
      food.draw()
      snake.draw()
    }, 1000 / FPS)
  }
}

class Food {
  constructor(mapBlockSize) {
    this.mapBlockSize = mapBlockSize
    this.x = Math.floor(Math.random() * this.mapBlockSize)
    this.y = Math.floor(Math.random() * this.mapBlockSize)
  }

  move() {
    this.x = Math.floor(Math.random() * this.mapBlockSize)
    this.y = Math.floor(Math.random() * this.mapBlockSize)
  }

  draw() {
    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(this.x * this.mapBlockSize, this.y * this.mapBlockSize, this.mapBlockSize, this.mapBlockSize)
  }
}

class Snake {
  constructor(mapBlockSize) {
    this.mapBlockSize = mapBlockSize
    this.head = {
      x: Math.floor(Math.random() * this.mapBlockSize),
      y: Math.floor(Math.random() * this.mapBlockSize)
    }
    this.tail = []
  }

  move() {

  }

  draw() {
    canvasContext.fillStyle = 'green'
    canvasContext.fillRect(this.head.x * this.mapBlockSize, this.head.y * this.mapBlockSize, this.mapBlockSize, this.mapBlockSize)
  }
}
