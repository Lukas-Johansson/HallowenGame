import Projectile from './Projectile.js'
import spriteImage from './assets/sprites/Idle Run (78x58).png'
export default class Player {
  constructor(game) {
    this.game = game
    this.width = 78
    this.height = 58
    this.x = 50
    this.y = 100

    this.frameX = 0

    this.projectiles = []

    this.speedX = 0
    this.speedY = 0
    this.maxSpeed = 6
    this.jumpSpeed = 14
    this.grounded = false

    // adding sprite image
    const image = new Image()
    image.src = spriteImage
    this.image = image

    // sprite animation
    this.frameX = 0
    this.frameY = 1
    this.maxFrame = 8
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    // flip sprite direction
    this.flip = false

    // sound
    this.sound = new Sound(this.game)
  }

  update(deltaTime) {
    if (this.game.keys.includes('ArrowLeft')) {
      this.speedX = -this.maxSpeed
    } else if (this.game.keys.includes('ArrowRight')) {
      this.speedX = this.maxSpeed
    } else {
      this.speedX = 0
    }

    if (this.game.keys.includes('ArrowUp') && this.grounded) {
      this.speedY = -this.jumpSpeed
      this.grounded = false
    }

    if (this.grounded) {
      this.speedY = 0
    } else {
      this.speedY += this.game.gravity
    }

    // play run or idle animation
    if (this.speedX !== 0) {
      this.frameY = 1
    } else {
      this.frameY = 0
    }

    this.y += this.speedY
    this.x += this.speedX

    // projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update()
    })
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    )

    // flip sprite direction
    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
    }

    // sprite animation update
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }

    // reset frameX when it reaches maxFrame
    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }
  }

  draw(context) {
    this.projectiles.forEach((projectile) => {
      projectile.draw(context)
    })

    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height)
      context.fillStyle = 'black'
      context.font = '12px Arial'
      context.fillText(this.frameX, this.x, this.y - 5)
      context.fillText(this.grounded, this.x + 20, this.y - 5)
    }

    // draw sprite image
    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height - 14,
      this.width,
      this.height,
      this.flip ? this.x * -1 - this.width : this.x,
      this.y,
      this.width,
      this.height
    )

    context.restore()
  }

  shoot() {
    this.sound.playShootSound()
    this.projectiles.push(
      new Projectile(this.game, this.x + this.width, this.y + this.height / 2)
    )
  }
}
