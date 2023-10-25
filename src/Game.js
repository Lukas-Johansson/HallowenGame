import InputHandler from './InputHandler.js'
import Player from './Player.js'
import UserInterface from './UserInterface.js'
import Pumpkin from './Pumpkin.js'
import Candy from './Candy.js'
export default class Game {
  constructor(width, height, canvasPosition) {
    this.width = width
    this.height = height
    this.canvasPosition = canvasPosition
    this.input = new InputHandler(this)
    this.ui = new UserInterface(this)
    this.keys = []
    this.enemies = []
    this.gameOver = false
    this.gravity = 1
    this.debug = false
    this.gameTime = 0
    this.enemies = []
    this.enemyTimer = 0
    this.enemyInterval = 1000

    this.player = new Player(this)
  }

  update(deltaTime) {
    if (!this.gameOver) {
      this.gameTime += deltaTime
    }

    if (this.enemyTimer > this.enemyInterval) {
        let x = Math.random() < 0.5 ? 0 : this.width // spawn on left or right edge
        let y = Math.random() < 0.5 ? 0 : this.height // spawn on top or bottom edge
        if (x === 0) {
          y = Math.random() * this.height // if on left edge, randomize y position
        } else if (x === this.width) {
          y = Math.random() * this.height // if on right edge, randomize y position
        } else if (y === 0) {
          x = Math.random() * this.width // if on top edge, randomize x position
        } else {
          x = Math.random() * this.width // if on bottom edge, randomize x position
        }
        if (Math.random() < 0.2) {
          this.enemies.push(new Candy(this, x, y))
        } else {
          this.enemies.push(new Pumpkin(this, x, y))
        }
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }
    
      // Check if player is going out of bounds and adjust their position accordingly
      if (this.player.x < 0) {
        this.player.x = 0
      } else if (this.player.x > this.width - this.player.width) {
        this.player.x = this.width - this.player.width
      }
      if (this.player.y < 0) {
        this.player.y = 0
      } else if (this.player.y > this.height - this.player.height) {
        this.player.y = this.height - this.player.height
      }
    
      this.player.update(deltaTime)
    
      let allEnemiesDefeated = true
      this.enemies.forEach((enemy) => {
        enemy.update(this.player)
        if (this.checkCollision(this.player, enemy)) {
          this.player.lives--
          enemy.markedForDeletion = true
          if (enemy.type === 'candy') {
            this.player.ammo += 5
          }
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            if (enemy.lives > 1) {
              enemy.lives -= projectile.damage
            } else {
              enemy.markedForDeletion = true
            }
            projectile.markedForDeletion = true
          }
        })
        if (!enemy.markedForDeletion) {
          allEnemiesDefeated = false
        }
      })
    
      if (allEnemiesDefeated && this.enemies.length > 0) {
        this.round++
        this.initializeEnemies()
      }
    
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)
    }

  draw(context) {
    this.ui.draw(context)
    this.player.draw(context)
    this.enemies.forEach((enemy) => {
      enemy.draw(context)
    })
  }

  checkCollision(object1, object2) {
    return (
      object1.x < object2.x + object2.width &&
      object1.x + object1.width > object2.x &&
      object1.y < object2.y + object2.height &&
      object1.height + object1.y > object2.y
    )
  }

}
