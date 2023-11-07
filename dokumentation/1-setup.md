
I alla kod-exempel betyder ```...``` att det finns kod där men den skrivs inte ut. Detta för att kodens exempel inte ska bli för långa.

Projektet är skapat med vite.
Spelet är uppdelat i ett flertal klasser/moduler för att hålla koden ren och lättläslig.

Spelmotorn startas från `index.html` -> `main.js` som i sin tur kallar på funktionen `setup()` för att starta spelet.
Koden i `setup.js` ska du på det stora hela inte ändra på. Det som du kan justera är spelets storlek, bredd och höjd.

## Förklaring setup.js

### Importera Game från './Game'

```javascript
import Game from './Game'
```

I koden importerar vi en modul eller ett objekt som heter "Game" från en annan fil som heter 'Game'. Detta indikerar att det finns andra kodfiler i samma projekt som innehåller huvudlogiken för spelet.

### Definiera funktionen `setup(canvas)`

```javascript
export function setup(canvas) {
```

Detta är en export av en funktion som heter `setup`, och den tar en parameter `canvas`. Funktionen används för att sätta upp och konfigurera spelet på en HTML Canvas-element som skickas som argument.

### Skapa 2D ritkontext (`ctx`) från canvas-elementet

```javascript
const ctx = canvas.getContext('2d')
```

Canvas behöver en "2D ritkontext" (ctx) från det Canvas-element som skickades som argument. En 2D ritkontext används för att rita bilder och grafik på Canvas-elementet.

### Konfigurera bredden och höjden på canvas elementet

```javascript
canvas.width = 854
canvas.height = 480
```

Storleken på Canvas-elementet sätts till en bredd på 854 pixlar och en höjd på 480 pixlar. Detta skapar en specifik spelområdesstorlek.

### Skapa ett nytt spelobjekt (`game`) med angiven bredd och höjd

```javascript
const game = new Game(canvas.width, canvas.height)
```

Här skapar vi en instans av ett spelobjekt, Game klassen, med bredd och höjd som har satts till canvasens storlek.

### Skapa en variabel `lastTime` för att hantera uppdateringshastighet

```javascript
let lastTime = 0
```

Den här variabeln används senare för att räkna ut tidsdifferensen mellan bildrutor (frames) och reglera spelets uppdateringshastighet.

### Definiera spelets animationsfunktion (`animate`) som används för att uppdatera och rita spelet

```javascript
const animate = (timeStamp) => {
```

Här definieras en funktion som tar en tidsstämpel (`timeStamp`) som argument. Denna funktion kommer att köras som en del av en animationsloop. Denna funktion tar emot en tidsstämpel (timeStamp) som används för att reglera tidsbaserade händelser i spelet.

### Beräkna tidsdifferensen (`deltaTime`) sedan förra bildrutan

```javascript
const deltaTime = timeStamp - lastTime
lastTime = timeStamp
```

Vi räknar ut tidsdifferensen (deltaTime) mellan den nuvarande tidsstämpeln och den senaste tidsstämpeln som sparats i variabeln lastTime. Detta används för att reglera uppdateringshastigheten i spelet.

### Rensa canvasen (tar bort det som tidigare ritats)

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height)
```

`ctx.clearRect(0, 0, canvas.width, canvas.height) används för att rensa bort tidigare bildrutor på canvasen innan nästa bild ritas. Utan detta skulle tidigare ritytor synas under de nya, vilket skulle skapa en otydlig och störande visuell effekt i spelet. Så, det ger oss en ren "duk" att börja rita på, vilket skapar en smidig övergång mellan bilderna när spelet uppdateras i animationsloopen.

### Uppdatera och rita spelet

```javascript
game.update(deltaTime)
game.draw(ctx)
```

Här anropas `update`-metoden och `draw`-metoden på det `game`-objekt som skapades tidigare. Detta uppdaterar och ritar spelet baserat på `deltaTime`. DeltaTime är tidsdifferensen mellan den nuvarande tidsstämpeln och den senaste tidsstämpeln som sparats i variabeln lastTime. 

### Skapa animationsloopen genom att använda `requestAnimationFrame` för att anropa sig själv

```javascript
requestAnimationFrame(animate)
```

Den här raden anropar funktionen `animate` igen med `requestAnimationFrame`, vilket skapar en loop där `animate`-funktionen kör igen och igen för att uppdatera och rita spelet.

Sammanfattningsvis sätter den här koden upp en enkel spelapplikation som använder en HTML Canvas för att rita och uppdatera spelet. Den använder en animationsloop för att reglera uppdateringshastigheten och hantera spelets logik med hjälp av ett `Game`-objekt.