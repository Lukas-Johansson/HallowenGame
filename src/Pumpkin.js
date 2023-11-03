import Enemy from './Enemy.js';
const pumpkin = new Pumpkin(gameInstance, x, y, ''); // Replace 'path/to/pumpkin.png' with the actual path to your pumpkin image

export default class Pumpkin extends Enemy {
  constructor(game, x, y, imageSrc) {
    super(game, imageSrc); // Pass the image source here
    this.width = 32;
    this.height = 32;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.lives = Math.floor(Math.random() * 3) + 1;
  }

  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speedX = (dx / distance) * this.speed;
    const speedY = (dy / distance) * this.speed;
    this.x += speedX;
    this.y += speedY;
  }
}