import Usable from './Usable';

const defaultImageUrl = 'src/assets/sprites/candy.webp';

export default class Candy extends Usable {
  constructor(game, x, y) {
    super(game, defaultImageUrl, x, y, 50, 50); // Set width and height directly
    this.speed = 0;
    this.lives = 1;
    this.type = 'usable';
  }
}
