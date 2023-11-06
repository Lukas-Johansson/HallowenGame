import Button from "./Button"

export default class UserInterface {
  constructor(game) {
    this.game = game
    this.fontSize = 25
    this.fontFamily = 'Arial'
    this.white = 'white'
    this.black = 'black'
    this.blue = 'blue'
    this.purple = '#640080'
    this.green = '#08e600'
    this.red = '#cc0600'
    this.orange = '#ff9a00'

    //stats window
    this.statWindow = false
    // buttons 
    this.startGameButton
    this.backButton
    this.gameOverButton
    this.menuButton
    this.controlButton

    window.addEventListener('mousedown', (event) => {
      if (!this.game.startGame && !this.statWindow) {
        if (this.isInsideButton(this.startGameButton.x, this.startGameButton.y, this.startGameButton.width, this.startGameButton.height)) {
          this.game.startGame = true
        }
        else if (this.isInsideButton(this.statsButton.x, this.statsButton.y, this.statsButton.width, this.statsButton.height)) {
          this.statWindow = true
        }
      }
      
      else if (!this.game.startGame && this.statWindow) {
        if (this.isInsideButton(this.backButton.x, this.backButton.y, this.backButton.width, this.backButton.height)) {
          this.statWindow = false
        }
      }

      if (this.game.startGame && this.game.upgradeScreen) {
        this.upgradeScreenButtons.forEach(element => {
          if (this.isInsideButton(element.x, element.y, element.width, element.height)) {
            this.upgradeScreenButtonCheck(element)
          }
        });
      }
      if (this.game.gameOver) {
        if (this.isInsideButton(this.gameOverButton.x, this.gameOverButton.y, this.gameOverButton.width, this.gameOverButton.height)) {
          this.game.gameReset = true
        }
        else if (this.isInsideButton(this.menuButton.x, this.menuButton.y, this.menuButton.width, this.menuButton.height)) {
          this.game.startGame = false
          this.game.gameOver = false
          this.game.gameReset = true
        }
      }
    })
  }

  draw(context) {
    context.save()
    context.fillStyle = this.white
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    context.shadowColor = this.black

    // draw game over 
    if (this.game.gameOver) {
      context.textAlign = 'center'
      context.font = `50px ${this.fontFamily}`
      context.fillText(
        'Game over',
        this.game.width / 2,
        this.game.height / 2 - 100
      )
      this.gameOverButton = new Button(
        this.game,
        context,
        this.game.width / 2 - 100,
        this.game.height / 2 + 30,
        200,
        50,
        'Start Over',
        this.black,
        this.orange,
        35,
        this.fontFamily,
        0,
        10
      )

      this.menuButton = new Button(
        this.game,
        context,
        this.game.width / 2 - 100,
        this.game.height / 2 + 120,
        200,
        50,
        'Main Menu',
        this.black,
        this.orange,
        35,
        this.fontFamily,
        0,
        10
      )

    }

    // when the game has not started 
    if (!this.game.startGame && !this.statWindow) {

      context.textAlign = 'center'
      context.font = `50px ${this.fontFamily}`
      context.fillText(
        'Spökhunter',
        this.game.width / 2,
        this.game.height / 2 - 175
      )

      this.startGameButton = new Button(
        this.game,
        context,
        this.game.width / 2 - 100,
        this.game.height / 2 + 100,
        200,
        50,
        'Start Game',
        this.black,
        this.orange,
        35,
        this.fontFamily,
        0,
        10
      )

      context.textAlign = 'center'
      context.font = `30px ${this.fontFamily}`
      context.fillText(
        'Move on [W] [A] [S] [D]',
        this.game.width / 2,
        this.game.height / 2 + 200,
      )

      context.textAlign = 'center'
      context.font = `30px ${this.fontFamily}`
      context.fillText(
        'Aim with your mouse and click to fire bullets',
        this.game.width / 2,
        this.game.height / 2 + 250,
      )

      context.textAlign = 'center'
      context.font = `30px ${this.fontFamily}`
      context.fillText(
        'The blue candy gives [10 ammo] once destroyed',
        this.game.width / 2,
        this.game.height / 2 + 300,
      )
    }

    // when game is running 
    if (this.game.startGame) {
      // stats in the left
      context.textAlign = 'left'
      context.font = `${this.fontSize}px ${this.fontFamily}`
      context.fillText(`Wave: ${this.game.wave}`, 30, 50)
      context.fillText(`Lives: ${this.game.player.lives}`, 30, 90)
      context.fillText(`Ammo: ${this.game.player.ammo}`, 30, 130)
      context.fillText(`Time: ${(this.game.gameTime * 0.001).toFixed(1)}`, 30, 170)
    }

    // debug display 
    if (this.game.debug) {
      context.font = `15px Arial`
      context.textAlign = 'right'
      context.fillText(`x: ${this.game.player.x}`, this.game.width - 20, 25)
      context.fillText(`y: ${this.game.player.y}`, this.game.width - 20, 50)
      context.fillText(
        `mouseX: ${this.game.input.mouseX}`,
        this.game.width - 20,
        75
      )
      context.fillText(
        `mouseY: ${this.game.input.mouseY}`,
        this.game.width - 20,
        100
      )
      context.fillText(
        `maxSpeed: ${this.game.player.maxSpeed}`,
        this.game.width - 20,
        125
      )
      context.fillText(`keys: ${this.game.keys}`, this.game.width - 20, 150)
      context.fillText(`Enemies: ${this.game.enemies.length}`, this.game.width - 20, 175)
      context.fillText(`Pickups: ${this.game.pickUpsArray.length}`, this.game.width - 20, 200)

      //stats
      context.fillText(`Kills: ${this.game.enemyKills}`, this.game.width - 20, 225)
      context.fillText(`Heals: ${this.game.healPickups}`, this.game.width - 20, 250)
      context.fillText(`Coin blocks: ${this.game.coinsBlock}`, this.game.width - 20, 275)

    }
    context.restore()
  }

  isInsideButton(x, y, width, height) {
    if (this.game.input.mouseX > x && this.game.input.mouseX < x + width && this.game.input.mouseY > y && this.game.input.mouseY < y + height) {
      return (true)
    }
  }

  

}