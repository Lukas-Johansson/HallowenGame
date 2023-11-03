import Usable from './Usable';

const defaultImageUrl = 'src\assets\sprites.764.png'; 

// Preload the default image
const defaultImage = new Image();
defaultImage.src = defaultImageUrl;

export default class Candy extends Usable {
  constructor(game, x, y, image = defaultImage) {
    super(game, x, y, image);
    this.width = 32;
    this.height = 32;
    this.speed = 0;
    this.lives = 1;
    this.type = 'usable';
  }
}
