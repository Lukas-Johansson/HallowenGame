export default class Enemy {
  constructor(game, imageUrl) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.onload = () => {
      // You can set the width and height here if needed
    };
    this.image.src = imageUrl;
    this.type = 'enemy';
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.x < 0 || this.x > this.game.width) this.markedForDeletion = true;
    if (this.y < 0 || this.y > this.game.height) this.markedForDeletion = true;
  }

  draw(context) {
    // Only draw the image if it's loaded
    if (this.image.complete) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);

      if (this.game.debug) {
        // Add your debug code here...
      }
    }
  }
}
