export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.mouseX = 0;
    this.mouseY = 0;

    // Add a new property to track the Q key press time
    this.qKeyPressTime = 0;

    window.addEventListener('keydown', (event) => {
      if (
        (event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight' ||
          event.key === 'w' ||
          event.key === 'a' ||
          event.key === 's' ||
          event.key === 'd' ||
          event.key === 'q' ||
          event.key === 'W' ||
          event.key === 'A' ||
          event.key === 'S' ||
          event.key === 'Q' ||
          event.key === 'D') &&
        this.game.keys.indexOf(event.key) === -1
      ) {
        this.game.keys.push(event.key);
      }

      if (event.key === ' ') {
        this.game.player.shoot(this.mouseX, this.mouseY);
      }

      if (event.key === 'p') {
        this.game.debug = !this.game.debug;
      }

      // Check if the Q key is pressed and record the timestamp
      if (event.key === 'Q' || event.key === 'q') {
        this.qKeyPressTime = Date.now();
      }
    });

    // Add an event listener for the keyup event to reset the Q key press time
    window.addEventListener('keyup', (event) => {
      if (this.game.keys.indexOf(event.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
      }

      if (event.key === 'Q' || event.key === 'q') {
        this.qKeyPressTime = 0;
      }
    });

    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX - this.game.canvasPosition.left;
      this.mouseY = event.clientY - this.game.canvasPosition.top;
    });

    window.addEventListener('mousedown', (event) => {
      this.game.player.shoot(this.mouseX, this.mouseY);
    });
  }
}
