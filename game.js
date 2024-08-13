const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')
const $speed = document.getElementById('game-speed')
const $mapSize = document.getElementById('map-size')
const $points = document.getElementById('points')
const $maxPoints = document.getElementById('max-points')
const $reset = document.getElementById('reset')

const defaultMapSize = 20
const defaultSpeed = 20
let mapSize
let speed
const DIRECTIONS = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down'
}

window.onload = () => {
  mapSize = $mapSize.value
  speed = $speed.value

  const game = new Game(mapSize)
  game.init()

  $speed.addEventListener('change', e => {
    speed = parseInt(e.target.value) > 0 ? parseInt(e.target.value) : defaultSpeed
    game.reset()
    $speed.blur()
  })

  $mapSize.addEventListener('change', e => {
    mapSize = parseInt(e.target.value) > 0 ? parseInt(e.target.value) : defaultMapSize
    game.reset(mapSize)
    $mapSize.blur()
  })

  $reset.addEventListener('click', () => {
    game.reset()
  })
}

class Game {
  constructor(mapBlocks) {
    this.mapBlocks = mapBlocks
    this.mapBlocksSize = Math.floor(canvas.width / this.mapBlocks)
    this.points = 0
    this.food = null
    this.snake = null
    this.interval = null
  }

  addPoint() {
    this.points = this.points + 1
  }

  drawMap() {
    for (let x = 0; x < this.mapBlocks; x++) {
      for (let y = 0; y < this.mapBlocks; y++) {
        canvasContext.strokeStyle = '#ddd'
        canvasContext.strokeRect(x * this.mapBlocksSize, y * this.mapBlocksSize, this.mapBlocksSize, this.mapBlocksSize)
      }
    }
  }

  drawPoints() {
    $points.innerHTML = this.points
  }

  init() {
    this.food = new Food(this.mapBlocksSize)
    this.snake = new Snake(this.mapBlocksSize)

    document.addEventListener('keydown', (e) => {
      this.snake.changeDirection(e.code)
    })

    this.loop()
  }

  loop() {
    clearInterval(this.interval)

    this.interval = setInterval(() => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      this.drawMap()
      this.food.draw()
      this.snake.move()
      if (this.snake.checkCollisionWithFood(this.food)) {
        this.addPoint()
        this.drawPoints()
        this.snake.grow()
        this.food.move()
        this.food.draw()
      }
      this.snake.draw()
    }, 1000 / speed)
  }

  reset(mapBlocks = null) {
    if (mapBlocks !== null) {
      this.mapBlocks = mapBlocks
      this.mapBlocksSize = Math.floor(canvas.width / this.mapBlocks)
    }
    this.points = 0
    this.drawPoints()
    this.food = new Food(this.mapBlocksSize)
    this.snake = new Snake(this.mapBlocksSize)
    this.loop()
  }
}

class Food {
  constructor(mapBlockSize) {
    this.mapBlockSize = mapBlockSize
    this.move()
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
    this.direction = DIRECTIONS.right
  }

  changeDirection(keyCode) {
    if (keyCode === 'ArrowLeft' || keyCode === 'KeyA') {
      this.direction = DIRECTIONS.left
    } else if (keyCode === 'ArrowUp' || keyCode === 'KeyW') {
      this.direction = DIRECTIONS.up
    } else if (keyCode === 'ArrowRight' || keyCode === 'KeyD') {
      this.direction = DIRECTIONS.right
    } else if (keyCode === 'ArrowDown' || keyCode === 'KeyS') {
      this.direction = DIRECTIONS.down
    }
  }

  checkCollisionWithFood(food) {
    return this.head.x === food.x && this.head.y === food.y
  }

  draw() {
    canvasContext.fillStyle = 'green'
    canvasContext.fillRect(this.head.x * this.mapBlockSize, this.head.y * this.mapBlockSize, this.mapBlockSize, this.mapBlockSize)

    canvasContext.fillStyle = 'blue'
    this.tail.forEach(el => {
      canvasContext.fillRect(el.x * this.mapBlockSize, el.y * this.mapBlockSize, this.mapBlockSize, this.mapBlockSize)
    })
  }

  grow() {
    let newBodyElement
    if (this.tail.length <= 0) {
      switch (this.direction) {
        case DIRECTIONS.left:
          newBodyElement = {
            x: this.head.x + 1,
            y: this.head.y
          }
          break
        case DIRECTIONS.up:
          newBodyElement = {
            x: this.head.x,
            y: this.head.y - 1
          }
          break
        case DIRECTIONS.right:
          newBodyElement = {
            x: this.head.x - 1,
            y: this.head.y
          }
          break
        case DIRECTIONS.down:
          newBodyElement = {
            x: this.head.x,
            y: this.head.y + 1
          }
          break
      }
    } else {
      const lastBodyElement = this.tail[this.tail.length - 1]
      switch (this.direction) {
        case DIRECTIONS.left:
          newBodyElement = {
            x: lastBodyElement.x + 1,
            y: lastBodyElement.y
          }
          break
        case DIRECTIONS.up:
          newBodyElement = {
            x: lastBodyElement.x,
            y: lastBodyElement.y - 1
          }
          break
        case DIRECTIONS.right:
          newBodyElement = {
            x: lastBodyElement.x - 1,
            y: lastBodyElement.y
          }
          break
        case DIRECTIONS.down:
          newBodyElement = {
            x: lastBodyElement.x,
            y: lastBodyElement.y + 1
          }
          break
      }
    }
    this.tail.push(newBodyElement)
  }

  move() {
    let previousElement = structuredClone(this.head)
    switch (this.direction) {
      case DIRECTIONS.left:
        if (this.head.x <= 0) {
          this.head = {
            x: mapSize,
            y: this.head.y
          }
        } else {
          this.head = {
            x: this.head.x - 1,
            y: this.head.y
          }
        }
        break
      case DIRECTIONS.up:
        if (this.head.y <= 0) {
          this.head = {
            x: this.head.x,
            y: mapSize
          }
        } else {
          this.head = {
            x: this.head.x,
            y: this.head.y - 1
          }
        }
        break
      case DIRECTIONS.right:
        if (this.head.x >= mapSize) {
          this.head = {
            x: 0,
            y: this.head.y
          }
        } else {
          this.head = {
            x: this.head.x + 1,
            y: this.head.y
          }
        }
        break
      case DIRECTIONS.down:
        if (this.head.y >= mapSize) {
          this.head = {
            x: this.head.x,
            y: 0
          }
        } else {
          this.head = {
            x: this.head.x,
            y: this.head.y + 1
          }
        }
        break
    }

    this.tail = this.tail.map(currentElement => {
      const currentElementCopy = structuredClone(currentElement)

      currentElement.x = parseInt(previousElement.x)
      currentElement.y = parseInt(previousElement.y)

      previousElement = structuredClone(currentElementCopy)
      return currentElement
    })
  }
}
