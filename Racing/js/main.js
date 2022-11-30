const app = new PIXI.Application(
        {
            width: 1280,
            height: 720, 
            backgroundColor: 0xAAAAAA
        }
    );

    // Canvas is appended to page after the page loads
    window.onload = function() {
        document.querySelector("div").appendChild(app.view)
    }


    // Sprite Sheet data
    const cars = {
        frames: {
            car: {
                frame: { x: 0, y:0, w:16, h:16 },
                sourceSize: { w: 16, h: 16 },
                spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 }
        }
    },
    meta: {
        image: 'images/Mini Pixel Pack 2/Cars/Player_green (16 x 16).png',
        format: 'RGBA8888',
        size: {w: 128, h: 16},
        scale: 1
    }
}

    let car = PIXI.BaseTexture.from(car);
    //const car = PIXI.Sprite.from('images/Mini Pixel Pack 2/Cars/Player_green (16 x 16).png', 16, 16);
    //const car = PIXI.TilingSprite.from('images/Mini Pixel Pack 2/Cars/Player_green (16 x 16).png', 16);


    setup();

function setup() {
    let stage = app.stage;
    stage.addChild(car);
    car.anchor.set(0.5);
    car.x = app.screen.width / 2;
    car.y = app.screen.height / 2;
}
