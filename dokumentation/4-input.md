För att styra spelet kommer vi nu skapa en klass med namnet `InputHandler`. Klaasen används för att hantera användarinmatning (tangenttryckningar).

```javascript
export default class InputHandler {
```

- `export default class InputHandler {`: Här definieras en klass med namnet `InputHandler`. Klassen används för att hantera användarinmatning i spelet.

```javascript
  constructor(game) {
    this.game = game
```

- `constructor(game) {`: Detta är konstruktorn för klassen `InputHandler`. Den tar ett argument `game`, en referens till spelet där användarinmatningen ska hanteras. Konstruktorn sparar detta spelobjekt i `this.game` för att kunna använda det senare.

```javascript
    window.addEventListener('keydown', (event) => {
```

- `window.addEventListener('keydown', (event) => {`: Här lägger vi till en lyssnare för tangentnedtryckningar (`keydown`) på hela webbsidan. När en tangent trycks ned, körs den tillhörande funktionen. `event` är händelsens objekt som innehåller information om tangentnedtryckningen.

```javascript
      if (
        (event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight') &&
        this.game.keys.indexOf(event.key) === -1
      ) {
        this.game.keys.push(event.key)
      }
```

- Här kontrollerar vi om den tryckta tangenten är någon av pilknapparna (upp, ner, vänster eller höger) och om den inte redan finns i `this.game.keys` (en lista som lagrar aktiva knapptryckningar). Om det är fallet, lägger vi till tangenten i listan `this.game.keys`.

- Koden använder en array (this.game.keys) för att spåra aktiva tangenttryckningar eftersom det möjliggör för spelaren att röra sig åt flera håll samtidigt. Genom att lagra tryckta tangenter i en lista kan spelet hantera flera tangenttryckningar samtidigt och därmed möjliggöra fler rörelsemöjligheter. Om varje tangenttryckning bara kontrollerade en enskild riktning skulle spelaren inte kunna röra sig åt flera håll samtidigt.

```javascript
      if (event.key === 'd') {
        this.game.debug = !this.game.debug
      }
```

- Här kontrollerar vi om tangenten 'd' trycks ned. Om det är fallet, ändrar vi värdet på `this.game.debug`. Om `debug` är `true` blir det `false`, och om det är `false` blir det `true`. Detta används för att aktivera eller inaktivera felsökningsläget i spelet.

```javascript
    })

    window.addEventListener('keyup', (event) => {
```

- `window.addEventListener('keyup', (event) => {`: Här lägger vi till en lyssnare för när användaren släpper upp en tangent (`keyup`).

```javascript
      if (this.game.keys.indexOf(event.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
      }
    })
  }
}
```

- Här kontrollerar vi om den upplåtna tangenten (key up) finns i listan `this.game.keys`. Om tangenten finns i listan, tar vi bort den genom att använda array-metoden`splice`.


### Mitt spel kräver ett annat rörelsemönster

Det kan vara att ni gör en spaceshooter, flygare eller annat där ni behöver kontrollera om spelaren rör sig åt andra håll.

Eftersom `InputHandler` redan lyssnar efter pil upp och ned så behöver du redigare `Player.js`.

```javascript
update(deltaTime) {
  if (this.game.keys.includes('ArrowUp')) {
    this.speedY = -this.maxSpeed;
  } else if (this.game.keys.includes('ArrowDown')) {
      this.speedY = this.maxSpeed;
  } else {
      this.speedY = 0;
  }

  ...
  this.y += this.speedY;
}
```

Om din spelare ska hoppa eller kasta något så kan du lägga till en ny knapp i `InputHandler` och sedan kontrollera om den knappen trycks ned i `Player.js`.