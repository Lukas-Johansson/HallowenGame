import Usable from './Usable'

export default class Candy extends Usable {
  constructor(game, x, y) {
    super(game)
    this.width = 32
    this.height = 32
    this.x = x
    this.y = y
    this.speed = 0
    this.lives = 1
    this.color = 'blue'
    this.type = 'usable'
  }
}
