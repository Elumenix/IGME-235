const app = new PIXI.Application(
        {
            width: 1280,
            height: 720, 
            backgroundColor: 0xAAAAAA
        }
    );
    assets = PIXI.Assets;
    var keys = new Object;


    // Canvas is appended to page after the page loads
    window.onload = function() {
        document.querySelector("div").appendChild(app.view);
        window.addEventListener("keydown", keysDown);
        window.addEventListener("keyup", keysUp);
    }

   

    function keysDown(e) {
        console.log(e.keyCode);
        keys[e.keyCode] = true;
    }
    function keysUp(e) {
        console.log(e.keyCode);
        keys[e.keyCode] = false;
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
    app.ticker.add(gameLoop);



    stage.addChild(car);
    car.anchor.set(0.5);
    car.width = 32;
    car.height = 32
    car.x = app.screen.width / 2;
    car.y = app.screen.height / 2;
}

function gameLoop() {


    // W
    if (keys["87"]) {
    // Uses radians so math is correct
    car.y -= 3.0 * Math.cos(car.rotation);
    car.x += 3.0 * Math.sin(car.rotation);
    }

    // A
    if (keys["65"]) {
        // Uses degrees so it's a gradual turn
        car.angle -= 1;
    }

    // D
    if (keys["68"]) {
        // Uses degrees so it's a gradual turn
        car.angle += 1;
    }

}
