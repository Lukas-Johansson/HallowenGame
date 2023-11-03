export default class Enemy {
  constructor(game, imageSrc) {
    this.game = game;
    this.image = new Image();
    this.image.src = imageSrc;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.markedForDeletion = false;
    this.type = 'enemy';
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.x < 0 || this.x > this.game.width) this.markedForDeletion = true;
    if (this.y < 0 || this.y > this.game.height) this.markedForDeletion = true;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);

    if (this.game.debug) {
      // Debug drawing if needed...
    }
  }
}