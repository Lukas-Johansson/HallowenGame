import Enemy from './Enemy.js'
import spriteImage from './assets/sprites/boss.png'

export default class Pumpkin extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 48
    this.height = 50
    this.x = x
    this.y = y
    this.speed = 120
    this.lives = Math.floor(Math.random() * 3) + 5
    this.color = 'transparent'
    this.type = 'skeleton'
    this.damage = 20

    const image = new Image()
    image.src = spriteImage
    this.image = image

    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 4
    this.fps = 5
    this.timer = 0
    this.interval = 1000 / this.fps

    // flip sprite direction
    this.flip = false
  }

  update(deltaTime, player) {
    const dx = player.x - this.x // calculate the x distance to the player
    const dy = player.y - this.y // calculate the y distance to the player
    const distance = Math.sqrt(dx * dx + dy * dy) // calculate the total distance to the player
    const speedX = (dx / distance) * this.speed // calculate the x speed towards the player
    const speedY = (dy / distance) * this.speed // calculate the y speed towards the player
    this.x += speedX * (deltaTime / 1000) // move the enemy towards the player on the x axis
    this.y += speedY * (deltaTime / 1000) // move the enemy towards the player on the y axis

    if (this.x > player.x) {
      this.flip = true
    }
    else if (this.x < player.x) {
      this.flip = false
    }
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += this.fps
    }

    // reset frameX when it reaches maxFrame
    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }
  }
}