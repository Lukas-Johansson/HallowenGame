export default class Button {
    constructor(game, context, x, y, width, height, text, fillColor, textColor, fontSize, font, textXFix, textYFix) {
        this.game = game
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        context.fillStyle = fillColor;
        context.fillRect(x, y, width, height);
        context.fillStyle = textColor;
        context.textAlign = 'middle';
        context.font = `${fontSize}px ${font}`;
        context.shadowColor = 'transparent'
        context.fillText(text, x + width / 2 + textXFix, y + height / 2 + textYFix, width);

        //Reset
        context.shadowColor = this.game.ui.black
        context.fillStyle = this.game.ui.white;

    }
}