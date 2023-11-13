import Projectile from './Projectile.js';

import idleAsset from './assets/sprites/Idle.png'
import runAsset from './assets/sprites/walk.png'
import attackAsset from './assets/sprites/attack.png'

export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 128;
    this.height = 100;
    this.x = this.game.width / 2 - this.width / 2;
    this.y = this.game.height / 2 - this.height / 2;

    this.frameX = 0

    this.projectiles = [];

    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 120;

    this.maxAmmo = 1000;
    this.ammo = 50;
    this.ammoTimer = 0;
    this.ammoInterval = 5000;

    this.lives = 10;  

    // adding sprite image
    const idleImage = new Image()
    idleImage.src = idleAsset

    const runImage = new Image()
    runImage.src = runAsset

    const attackImage = new Image()
    attackImage.src = attackAsset

    this.frameX = 0
    this.maxFrame = 0 
    this.animationFps = 4
    this.animationTimer = 0
    this.animationInterval = 1000 / this.animationFps
    this.idle = {
      image: idleImage,
      frames: 7,
    }
    this.run = {
      image: runImage,
      frames: 7,
    }
    this.attack = {
      image: attackImage,
      frames: 9,
    }
    this.image = this.idle.image

    // flip sprite direction
    this.flip = false

    // shooting
    this.shooting = false
  }

  update(deltaTime) {
    if (this.lives <= 0) {
      this.game.gameOver = true;
    }

    if ((this.game.keys.includes('ArrowLeft') || this.game.keys.includes('a') || this.game.keys.includes('A')) && this.x > 0) {
      this.speedX = -this.maxSpeed;
    } else if (
      this.game.keys.includes('ArrowRight') ||
      this.game.keys.includes('d') ||
      this.game.keys.includes('D') 
    ) {
      this.speedX = this.maxSpeed;
    } else {
      this.speedX = 0;
    }

    if ((this.game.keys.includes('ArrowUp') || this.game.keys.includes('w') || this.game.keys.includes('W')) && this.y > 0) {
      this.speedY = -this.maxSpeed;
    } else if (
      this.game.keys.includes('ArrowDown') ||
      this.game.keys.includes('s')||
      this.game.keys.includes('S') 
    ) {
      this.speedY = this.maxSpeed;
    } else {
      this.speedY = 0;
    }

    this.y += this.speedY * (deltaTime / 1000)
    this.x += this.speedX * (deltaTime / 1000)

    if (this.ammoTimer > this.ammoInterval && this.ammo < this.maxAmmo) {
      this.ammoTimer = 0;
      this.ammo++;
    } else {
      this.ammoTimer += deltaTime;
    }

    if (this.shooting) {
      this.maxFrame = this.attack.frames
      this.image = this.attack.image
      if (this.frameX === this.attack.frames - 1) {
        this.shooting = false
      }
    } else if (this.speedX !== 0) {
      this.maxFrame = this.run.frames
      this.image = this.run.image
    } else {
      this.maxFrame = this.idle.frames
      this.image = this.idle.image
    }

    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
    }

    if (this.animationTimer > this.animationInterval) {
      this.frameX++
      this.animationTimer = 0
    } else {
      this.animationTimer += deltaTime
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }

    // Update and filter projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaTime);
    });
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
  }

  draw(context) {
    this.projectiles.forEach((projectile) => {
      projectile.draw(context)
    })

    if (this.game.debug) {
      context.strokeStyle = '#000';
      context.strokeRect(
        this.flip ? this.x - this.width : this.x, // Adjust x-coordinate based on flip
        this.y,
        this.width,
        this.height
      );
      context.lineWidth = 1;
      context.beginPath();
      const dx = this.game.input.mouseX - (this.x + this.width / 2);
      const dy = this.game.input.mouseY - (this.y + this.height / 2);
      const maxLength = 60;
      const angle = Math.atan2(dy, dx);
      const x = this.x + this.width / 2 + maxLength * Math.cos(angle);
      const y = this.y + this.height / 2 + maxLength * Math.sin(angle);
      context.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      context.lineTo(x, y);
      context.stroke();
    }

    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    }
    // s = source, d = destination
    // image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight
    context.drawImage(
      this.image,
      this.frameX * this.width,
      -10,
      this.width,
      this.height,
      this.flip ? this.x * -1 - this.width : this.x,
      this.y,
      this.width,
      this.height
    )

    context.restore()

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });
  }

  shoot(mouseX, mouseY) {
    // get angle between player and mouse
    const angle = Math.atan2(
      mouseY - (this.y + this.height / 2),
      mouseX - (this.x + this.width / 2)
    )

    this.shooting = true

    if (this.ammo > 0) {
      this.ammo--;
      this.projectiles.push(
        new Projectile(
          this.game,
          this.x + this.width / 2,
          this.y + this.height / 2,
          angle
        )
      )
    } else {
      console.log('out of ammo')
    }
  }
}
