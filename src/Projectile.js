import spriteImage from './assets/sprites/Charge_2.png';

export default class Projectile {
  constructor(game, x, y, angle) {
    this.game = game;
    this.width = 64;
    this.height = 128;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 300;
    this.damage = 1;
    this.markedForDeletion = false;

    this.image = new Image();
    this.image.onload = () => {
      // Start using the image after it's loaded
    };
    this.image.src = spriteImage;

    this.frameX = 0;
    this.maxFrame = 4; // Adjust this value based on the total number of frames in your sprite sheet
    this.fps = 4;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    this.flip = false;
  }

  update(deltaTime) {
    const velocity = {
      x: this.speed * Math.cos(this.angle),
      y: this.speed * Math.sin(this.angle),
    };

    this.x += velocity.x * (deltaTime / 1000);
    this.y += velocity.y * (deltaTime / 1000);

    if (this.x > this.game.width) {
      this.markedForDeletion = true;
    }

    if (this.timer > this.interval) {
      this.frameX++;
      this.timer = 0;
    } else {
      this.timer += deltaTime; // Use deltaTime here
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0;
    }
  }

  draw(context) {
    // Use drawImage to draw the sprite
    context.save();
    if (this.flip) {
      context.scale(-1, 1);
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.flip ? -(this.x + this.width / 2) : this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    context.restore();
  }
}
