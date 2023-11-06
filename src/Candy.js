import Usable from './Usable';

import defaultImageUrl from './assets/sprites/ammogodis.png';

export default class Candy extends Usable {
  constructor(game, x, y) {
    super(game, defaultImageUrl, x, y, 35, 35); // Set width and height directly
    this.speed = 0;
    this.lives = 1;
    this.type = 'usable';
  }
}
