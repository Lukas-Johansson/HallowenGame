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
            this.player.ammo = 0;
            return;
        }

        if (this.wave === 0) {
            this.player.ammo = 50;
        }

        if (this.gameReset) {
            this.reset();
            this.player = new Player(this);
            this.gameReset = false;
        }

        if (!this.gameOver) {
            this.gameTime += deltaTime;
        }

        if (this.gameOver) {
            this.player.ammo = 0;
            return;
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
                    const margin = 15; // Adjust this margin value as needed

                    // Calculate the range within which candies should spawn
                    const xRange = this.width - 2 * margin;
                    const yRange = this.height - 2 * margin;

                    // Generate random positions within the range
                    let x = margin + Math.random() * xRange;
                    let y = margin + Math.random() * yRange;

                    if (Math.random() < 0.3) {
                        this.usable.push(new Candy(this, x + 75, y + 75));
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
                this.waveInProgress = false; // Set the flag to indicate that the wave is no longer in progress
                this.startWave(); // Start a new wave
            }
        }

        this.player.update(deltaTime);

        // Collision detection and resolution for pumpkins
        this.enemies.forEach((enemy) => {
            enemy.update(deltaTime, this.player);
            if (this.checkCollision(this.player, enemy)) {
                this.player.lives--;
                enemy.markedForDeletion = true;
            }

            // Check collisions with other pumpkins and resolve them
            this.enemies.forEach((otherEnemy) => {
                if (enemy !== otherEnemy && this.checkCollision(enemy, otherEnemy)) {
                    this.resolveCollision(enemy, otherEnemy);
                }
            });

            this.player.projectiles.forEach((projectile) => {
                if (this.checkCollision(projectile, enemy)) {
                    if (enemy.lives > 1) {
                        enemy.lives -= projectile.damage;
                    } else {
                        enemy.markedForDeletion = true;
                    }
                    projectile.markedForDeletion = true;
                }
            });
        });

        // Filter out deleted enemies
        this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

        this.usable.forEach((usable) => {
            usable.update(deltaTime, this.player);
            if (this.checkCollisionUsable(this.player, usable)) {
                this.player.ammo += 10;
                usable.markedForDeletion = true;
            }

            this.player.projectiles.forEach((projectile) => {
                if (this.checkCollision(projectile, usable)) {
                    if (usable.lives > 1) {
                        usable.lives -= projectile.damage;
                    } else {
                        usable.markedForDeletion = true;
                        this.player.ammo += 10;
                    }
                    projectile.markedForDeletion = true;
                }
            });
        });

        // Filter out deleted usable items
        this.usable = this.usable.filter((usable) => !usable.markedForDeletion);

        if (this.player.lives <= 0) {
            // Handle game over
        }
    }


    reset() {
        this.keys = [];
        this.usable = [];
        this.enemies = [];

        this.gameReset = false;
        this.startGame = true;
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

    resolveCollision(pumpkin1, pumpkin2) {
        const dx = pumpkin2.x - pumpkin1.x;
        const dy = pumpkin2.y - pumpkin1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = (pumpkin1.width + pumpkin2.width) / 2 - distance;

        if (overlap > 0) {
            // Move the pumpkins away from each other
            const moveX = (dx / distance) * overlap;
            const moveY = (dy / distance) * overlap;
            pumpkin1.x -= moveX;
            pumpkin1.y -= moveY;
            pumpkin2.x += moveX;
            pumpkin2.y += moveY;
        }
    }

}