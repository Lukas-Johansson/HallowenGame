export default class Usable {
  constructor(game, imageUrl, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width; // Set the width
    this.height = height; // Set the height
    this.image = new Image();
    this.image.onload = () => {
      // Set the width and height after the image is loaded
      this.width = width;
      this.height = height;
    };
    this.image.src = imageUrl;
    this.type = 'usable';
    this.markedForDeletion = false;
  }

  update() {
    if (this.x < 0 || this.x > this.game.width) this.markedForDeletion = true;
    if (this.y < 0 || this.y > this.game.height) this.markedForDeletion = true;
  }

  draw(context) {
    // Only draw the image if it's loaded
    if (this.image.complete && this.width && this.height) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);

      if (this.game.debug) {
        // Rest of your debug code...
      }
    }
  }
}
