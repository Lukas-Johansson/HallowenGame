import Game from './Game';

export function setup(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(
    canvas.width,
    canvas.height,
    canvas.getBoundingClientRect()
  );

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.updateCanvasSize(canvas.width, canvas.height);
  };

  // Listen for window resize events and adjust the canvas accordingly
  window.addEventListener('resize', resizeCanvas);

  let lastTime = 0;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
}
