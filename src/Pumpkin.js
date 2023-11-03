import Enemy from './Enemy.js';

const defaultImageUrl = 'src/assets/sprites/ghost.webp'; 

export default class Pumpkin extends Enemy {
  constructor(game, x, y) {
    super(game, defaultImageUrl); 
    this.width = 60;
    this.height = 55;
    this.x = x;
    this.y = y;
    this.speed = 0.75;
    this.lives = Math.floor(Math.random() * 3) + 1;
    super.update
  }

  update(player) {
    const dx = player.x - this.x; 
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy); 
    const speedX = (dx / distance) * this.speed; 
    const speedY = (dy / distance) * this.speed; 
    this.x += speedX; 
    this.y += speedY; 
    super.update();
  }
}
