Skjuta eller kasta saker, skott eller något annat. För att göra detta kommer vi skapa en klass, `Projectile`. Projektilen har egenskaper som dess position, storlek, hastighet och skada, och den kan röras genom att uppdatera dess position i `update`-metoden och ritas på skärmen med hjälp av `draw`-metoden.

I denna version så rör sig projektilerna i en rak led från spelaren.

```javascript
export default class Projectile {
```

- `export default class Projectile`: Här definieras en klass med namnet `Projectile`. Denna klass kommer att användas för att beskriva egenskaper och beteenden för projektiler i spelet.

```javascript
  constructor(game, x, y) {
    this.game = game
    this.width = 4
    this.height = 4
    this.x = x
    this.y = y

    this.speed = 5
    this.damage = 1
    this.markedForDeletion = false
  }
```

- `constructor(game, x, y)`: Detta är konstruktorn för klassen `Projectile`. Den tar tre argument: `game` (en referens till spelet), `x` (x-koordinaten där projektilen skapas) och `y` (y-koordinaten där projektilen skapas). Konstruktorn sätter upp initiala egenskaper för projektilen, inklusive storlek (`width` och `height`), position (`x` och `y`), hastighet (`speed`), skada (`damage`) och en flagga (`markedForDeletion`) som används för att markera om projektilen ska tas bort senare. Det är viktigt att kunna ta bort projektiler som inte längre används för att undvika att de tar upp minne och processorkraft.

```javascript
  update() {
    this.x += this.speed
    if (this.x > this.game.width) {
      this.markedForDeletion = true
    }
  }
```

- `update()`: Denna metod används för att uppdatera projektilens logik och position. I detta fall ökar vi x-koordinaten (`this.x`) med projektilens hastighet (`this.speed`) för att få den att röra sig åt höger. Om projektilen går utanför spelets bredd (till höger om skärmen), markeras den för borttagning genom att sätta `markedForDeletion` till `true`.

```javascript
  draw(context) {
    context.fillStyle = '#ff0'
    context.fillRect(this.x, this.y, this.width, this.height)
  }
```

- `draw(context)`: Denna metod används för att rita projektilen på skärmen. Den sätter fyllningsfärgen på projektilen till gul (`'#ff0'`) och ritar en fyrkant (rektangel) med projektilens position (`this.x` och `this.y`), bredd (`this.width`) och höjd (`this.height`).

### Använda projektiler

Nu när vi har en klass för projektiler, kan vi använda den i spelet. Vi kommer att använda en lista för att lagra projektiler som skapas av spelaren. När en projektil skapas, läggs den till i listan. När en projektil ska tas bort, tas den bort från listan. I det här exemplet kommer projektilerna sparas på instansen av Player, eftersom de tillhör spelaren.

`Player.js`
```javascript
import Projectile from './Projectile.js'

export default class Player {
  constructor(game) {
  ...
  this.projectiles = []
  }

  update(deltaTime) {
    ...
    this.projectiles.forEach((projectile) => {
      projectile.update()
    })
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    )
  }

  draw(context) {
    ...
    this.projectiles.forEach((projectile) => {
      projectile.draw(context)
    })
  }
}
```

Koden ovan lägger till en lista för projektiler i konstruktorn för `Player`. I `update`-metoden uppdateras alla projektiler i listan. I `draw`-metoden ritas alla projektiler i listan. I `update`-metoden filtreras listan för att ta bort projektiler som är markerade för borttagning.

För att skapa och skjuta ut en projektil i spelet behöver vi en metod som kan anropas när spelaren vill skjuta. Vi skapar en metod i `Player` för detta, eftersom det är spelaren som skjuter.

```javascript
shoot() {
  this.projectiles.push(
    new Projectile(this.game, this.x + this.width, this.y + this.height / 2)
  )
}
```

- `shoot() `: Detta är en metod med namnet `shoot` som används för att utföra skjutaktionen.

- `this.projectiles.push(`: I listan `this.projectiles` lagras projektiler. Här lägger vi till en ny projektil i listan. Här används array-metoden `push` för att lägga till ett nytt element i listan.

- `new Projectile(this.game, this.x + this.width, this.y + this.height / 2)`: Här skapar vi en ny instans av klassen `Projectile`. Vi skickar med tre argument till konstruktorn:
  
  - `this.game`: En referens till spelet där projektilen existerar.
  - `this.x + this.width`: X-koordinaten där projektilen startar. Precis till höger om den nuvarande positionen av spelaren.
  - `this.y + this.height / 2`: Y-koordinaten där projektilen startar. Det är i mitten av höjden på spelaren.

Så, när `shoot()`-metoden anropas, skapas en ny projektil med de specificerade egenskaperna och läggs till i listan `projectiles`. Detta innebär att spelaren eller objektet som innehåller `shoot()`-metoden skjuter ut en projektil från sin nuvarande position.

Slutiltigen behöver vi anropa `shoot()`-metoden när spelaren trycker på en tangent. Detta görs i `InputHandler`-klassen.

```javascript
if (event.key === ' ') {
  this.game.player.shoot()
}
```

## Varianter på att skjuta

### deltaTime användas för att begränsa hur ofta spelaren kan skjuta.

```javascript
if (this.shootTimer > 0) {
  this.shootTimer -= deltaTime
}

if (event.key === ' ' && this.shootTimer <= 0) {
  this.game.player.shoot()
  this.shootTimer = 0.5
}
```

- `this.shootTimer`: En variabel som används för att hålla koll på hur lång tid det är kvar tills spelaren kan skjuta igen. När spelaren skjuter, sätts `this.shootTimer` till 0.5. När `this.shootTimer` är större än 0, kan inte spelaren skjuta. När `this.shootTimer` är mindre än eller lika med 0, kan spelaren skjuta.

- `this.shootTimer -= deltaTime`: Här minskar vi `this.shootTimer` med `deltaTime`. Detta innebär att `this.shootTimer` minskar med 1 varje sekund. När `this.shootTimer` är 0, kan spelaren skjuta igen.

### System för ammunition

Vi kan skapa ammunition för spelaren genom att lägga till en variabel för ammunition och en metod för att minska ammunitionen när spelaren skjuter.

```javascript
constructor(game) {
  ...
  this.ammo = 10
}

shoot() {
  if (this.ammo > 0) {
    this.projectiles.push(
      new Projectile(this.game, this.x + this.width, this.y + this.height / 2)
    )
    this.ammo--
  }
}
```

Detta kräver att spelaren kan regenerera eller få mer ammunition.