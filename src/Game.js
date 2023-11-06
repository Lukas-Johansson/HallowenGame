import InputHandler from './InputHandler.js';
import Player from './Player.js';
import UserInterface from './Ui/UserInterface.js';
import Pumpkin from './Pumpkin.js';
import Candy from './Candy.js';

export default class Game {
    constructor(width, height, canvasPosition) {
        this.width = width;
        this.height = height;
        this.canvasPosition = canvasPosition;
        this.input = new InputHandler(this);
        this.ui = new UserInterface(this);
        this.keys = [];
        this.usable = [];
        this.enemies = [];

        this.gameReset = false;
        this.startGame = false;
        this.gameOver = false;
        this.debug = false;

        this.gravity = 1;
        this.gameTime = 0;
        this.wave = 0; // Current wave
        this.enemyTimer = 0;
        this.enemyInterval = 1; // Adjust this interval as needed (e.g., increase it)
        this.enemiesPerWave = 1; // Number of enemies per wave (e.g., reduce it)    
        this.enemiesSpawnedInWave = 0; // Number of enemies spawned in the current wave
        this.player = new Player(this);
        this.waveInProgress = true; // Initialize the flag to indicate that a wave is in progress
        this.round = 1; // Initialize the round to 1
    }

    update(deltaTime) {
        if (!this.startGame) {
            return
        }

        if (this.gameReset) {
            this.reset()
            this.player = new Player(this)
            this.gameReset = false
        }

        if (!this.gameOver) {
            this.gameTime += deltaTime
        }

        //stop game
        if (this.gameOver) {
            return
        }

        this.player.update(deltaTime);

        // Perform boundary checks for the player
        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.x + this.player.width > this.width) {
            this.player.x = this.width - this.player.width;
        }
        if (this.player.y < 0) {
            this.player.y = 0;
        }
        if (this.player.y + this.player.height > this.height) {
            this.player.y = this.height - this.player.height;
        }

        if (this.enemiesSpawnedInWave < this.enemiesPerWave) {
            if (this.enemyTimer > this.enemyInterval) {
                const enemiesToSpawn = Math.min(this.enemiesPerWave - this.enemiesSpawnedInWave);

                for (let i = 0; i < enemiesToSpawn; i++) {
                    let x = Math.random() < 0.5 ? 0 : this.width + 0.2;
                    let y = Math.random() < 0.5 ? 0 : this.height + 0.2;
                    if (x === 0) {
                        y = Math.random() * this.height;
                    } else if (x === this.width) {
                        y = Math.random() * this.height;
                    } else if (y === 0) {
                        x = Math.random() * this.width;
                    } else {
                        y = Math.random() * this.height;
                    }
                    if (Math.random() < 0.2) {
                        this.usable.push(new Candy(this, x, y));
                    } else {
                        this.enemies.push(new Pumpkin(this, x, y));
                    }
                }

                this.enemyTimer = 0;
                this.enemiesSpawnedInWave += enemiesToSpawn;
            } else {
                this.enemyTimer += deltaTime;
            }
        } else {
            // All enemies in the current wave have been spawned.
            if (this.enemies.length === 0) {
                if (this.usable.length === 0) {
                    this.waveInProgress = false; // Set the flag to indicate that the wave is no longer in progress
                    this.startWave(); // Start a new wave
                }
            }
        }

        this.player.update(deltaTime);

        this.enemies.forEach((enemy) => {
            enemy.update(this.player);
            if (this.checkCollision(this.player, enemy)) {
                this.player.lives--;
                enemy.markedForDeletion = true;
            }

            this.player.projectiles.forEach((projectile) => {
                if (this.checkCollision(projectile, enemy,)) {
                    if (enemy.lives > 1) {
                        enemy.lives -= projectile.damage;
                    } else {
                        enemy.markedForDeletion = true;
                    }
                    projectile.markedForDeletion = true;
                }
            });
        });
        this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

        this.usable.forEach((usable) => {
            usable.update(this.player);
            if (this.checkCollisionUsable(this.player, usable)) {
                this.player.ammo += 10;
                usable.markedForDeletion = true;
            }

            this.player.projectiles.forEach((projectile) => {
                if (this.checkCollision(projectile, usable,)) {
                    if (usable.lives > 1) {
                        usable.lives -= projectile.damage;
                    } else {
                        usable.markedForDeletion = true;
                        this.player.ammo += 5;
                    }
                    projectile.markedForDeletion = true;
                }
            });
        });
        this.usable = this.usable.filter((usable) => !usable.markedForDeletion);

        if (this.player.lives <= 0) {
        }
    }

    startWave() {
        this.wave++;
        this.enemiesSpawnedInWave = 0;
        this.enemiesPerWave++; // Increase the number of enemies per wave
        this.enemyTimer = 0; // Reset the enemy spawn timer
        this.round++; // Increment the round
    }

    draw(context) {
        this.ui.draw(context);
        this.player.draw(context);
        this.usable.forEach((usable) => {
            usable.draw(context);
        });
        this.enemies.forEach((enemy) => {
            enemy.draw(context);
        });
    }

    checkCollision(object1, object2) {
        return (
            object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.y + object1.height > object2.y
        );
    }

    checkCollisionUsable(object1, object2) {
        return (
            object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.y + object1.height > object2.y
        );
    }

    reset() {
        this.gameTime = 0;
        this.wave = 0; // Current wave
        this.gameOver = false;
      }
    
}