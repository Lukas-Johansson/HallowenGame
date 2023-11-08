import Projectile from './Projectile.js';
import playerimage from './assets/sprites/player.png';

export default class Player {
  constructor(game) {
    this.game = game;
    this.playerImage = new Image();
    this.playerImage.src = playerimage;
    this.width = 43;
    this.height = 60;
    this.x = this.game.width / 2 - this.width / 2;
    this.y = this.game.height / 2 - this.height / 2;
    
    this.projectiles = [];

    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 120;

    this.maxAmmo = 1000;
    this.ammo = 50;
    this.ammoTimer = 0;
    this.ammoInterval = 5000;

    this.lives = 10;

    // Dash properties
    this.dashCooldown = 2000; // Dash cooldown time in milliseconds (adjust as needed)
    this.dashTimer = 0;
    this.isDashing = false;
    this.maxQKeyPressDuration = 200; // Adjust this value as needed
    this.dashCooldownTimer = 0;
  }

  update(deltaTime) {
    if (this.lives <= 0) {
      this.game.gameOver = true;
    }

    // Check if the player is not currently dashing and the dash cooldown has passed
    if (!this.isDashing && this.dashCooldownTimer <= 0) {
      if (
        (this.game.keys.includes('Q') || this.game.keys.includes('q')) &&
        this.dashTimer <= 0
      ) {
        // Check if the Q key press duration is within the allowed limit
        if (Date.now() - this.game.input.qKeyPressTime <= this.maxQKeyPressDuration) {
          this.isDashing = true;
          this.dashTimer = this.dashCooldown;

          // Adjust the dash speed as needed
          const dashSpeed = 200 * this.maxSpeed;

          // Calculate dash direction based on player's current speed
          const dashDirectionX = this.speedX > 0 ? 1 : this.speedX < 0 ? -1 : 0;
          const dashDirectionY = this.speedY > 0 ? 1 : this.speedY < 0 ? -1 : 0;

          // Apply the dash velocity
          this.x += dashDirectionX * dashSpeed * (deltaTime / 1000);
          this.y += dashDirectionY * dashSpeed * (deltaTime / 1000);

          // Set the dash timer to prevent rapid consecutive dashes
          this.dashCooldownTimer = this.dashCooldown;
        }
      }
    } else {
      // If the dash cooldown is active, decrement the cooldown timer
      if (this.dashCooldownTimer > 0) {
        this.dashCooldownTimer -= deltaTime;
      }
    }

    // Update the dash timer
    if (this.isDashing) {
      this.dashTimer -= deltaTime;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
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
      this.game.keys.includes('s') ||
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

    // Update and filter projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaTime);
    });
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
  }

  draw(context) {
    context.drawImage(this.playerImage, this.x, this.y, this.width, this.height);

    if (this.game.debug) {
      context.strokeStyle = '#000';
      context.strokeRect(this.x, this.y, this.width, this.height);
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

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });
  }

  shoot(mouseX, mouseY) {
    const angle = Math.atan2(
      mouseY - (this.y + this.height / 2),
      mouseX - (this.x + this.width / 2)
    );

    if (this.ammo > 0) {
      this.ammo--;
      this.projectiles.push(
        new Projectile(
          this.game,
          this.x + this.width / 2,
          this.y + this.height / 2,
          angle
        )
      );
    } else {
      console.log('Out of ammo');
    }
  }

  resetDash() {
    this.isDashing = false;
    this.dashTimer = 0;
  }
}
