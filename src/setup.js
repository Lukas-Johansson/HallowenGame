import Game from './Game'

export function setup(canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = 1280
  canvas.height = 700

  const game = new Game(
    canvas.width,
    canvas.height,
    canvas.getBoundingClientRect()
  )
  let lastTime = 0

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update(deltaTime)
    game.draw(ctx)
    requestAnimationFrame(animate)
  }

  animate(0)
}
