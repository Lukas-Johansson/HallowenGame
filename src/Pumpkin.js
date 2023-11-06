import Enemy from './Enemy.js';

const defaultImageUrl = 'src/assets/sprites/ghost.png'; 

export default class Pumpkin extends Enemy {
  constructor(game, x, y) {
    super(game, defaultImageUrl); 
    this.width = 30;
    this.height = 35;
    this.x = x;
    this.y = y;
    this.speed = 1.25;
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
