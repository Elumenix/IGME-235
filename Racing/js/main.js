const app = new PIXI.Application(
        {
            width: 1280,
            height: 720, 
            backgroundColor: 0xAAAAAA
        }
    );
    assets = PIXI.Assets;
    var keys = new Object;
    let velocity = 0;
    let maxSpeed = 4;
    let acceleration = 0


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
        acceleration = .1;
    }
    else if (velocity > 0) {
        acceleration = -.05;
    }
    else {
        acceleration = 0;
        if (velocity < 0) {
            velocity = 0
        }
    }

    // A
    if (keys["65"]) {
        // Uses degrees so it's a gradual turn
        car.angle -= .1875 * Math.pow(velocity, 2);

        // Turning will slow the player down
        if (acceleration === .1 && velocity > 2) {
            acceleration = -.015;
        }
    }

    // D
    if (keys["68"]) {
        // Uses degrees so it's a gradual turn
        car.angle += .1875 * Math.pow(velocity, 2);;

        // Turning will slow the player down
        if (acceleration === .1 && velocity > 2) {
            acceleration = -.015;
        }
    }

    // Movement
    velocity += acceleration;

    if (velocity > maxSpeed) {
        velocity = maxSpeed;
    }

    car.y -= velocity * Math.cos(car.rotation);
    car.x += velocity * Math.sin(car.rotation);

}
