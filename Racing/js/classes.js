class Road extends PIXI.Graphics{
    constructor(stage, sprite, anchor, x, y, scaleX = 1, scaleY = 1, rotation = 0){
        super();
        this.sprite = PIXI.Sprite.from(sprite._texture);
        this.x = x;
        this.y = y;
        addObject(stage, this.sprite, anchor, x, y, scaleX, scaleY, rotation)
        Object.seal(this);
    }
}
