const app = new PIXI.Application(
        {
            width: 1280,
            height: 720, 
            backgroundColor: 0xAAAAAA
        }
    );
    assets = PIXI.Assets;


    // Canvas is appended to page after the page loads
    window.onload = function() {
        document.querySelector("div").appendChild(app.view);
    }

    


   
    let car;

    const loadedTexture = assets.load("images/Mini Pixel Pack 2/Cars/Player_green (16 x 16).png");

    loadedTexture.then((resolvedTexture) => {
        const rect = new PIXI.Rectangle(0,0,16,16);
        resolvedTexture.frame = rect;
        car = new PIXI.Sprite(resolvedTexture);
        console.log(car);
        setup();
    });

function setup() {
    let stage = app.stage;


    stage.addChild(car);
    car.anchor.set(0.5);
    car.width = 32;
    car.height = 32
    car.x = app.screen.width / 2;
    car.y = app.screen.height / 2;
}
