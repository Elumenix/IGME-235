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
    let start;
    let finish;
    let straight1;
    let straight2;
    let straight3;

    assets.add('car', 'images/Mini_Pixel_Pack_2/Cars/Player_green_(16x16).png');
    assets.add('start', 'images/Tracks/Start.png');
    assets.add('finish', 'images/Tracks/Finish.png');
    assets.add('turn', 'images/Tracks/Road_01_Tile_01.png');
    assets.add('straight', 'images/Tracks/Road_01_Tile_03.png');



    const loadedTextures = assets.load('car');

    // Unfortunately messy as I needed a way for car to run by itself
    loadedTextures.then((resolvedTexture) => {
        // Gets the cars sprite
        const rect = new PIXI.Rectangle(0,0,16,16);
        resolvedTexture.frame = rect;
        car = new PIXI.Sprite(resolvedTexture);

        let nextLoadedTextures = assets.load(['start', 'finish', 'turn', 'straight']);
        nextLoadedTextures.then((resolvedTexture) => {
            straight1 = PIXI.Sprite.from(resolvedTexture.straight);
            straight2 = PIXI.Sprite.from(resolvedTexture.straight);
            straight3 = PIXI.Sprite.from(resolvedTexture.straight);
            start = PIXI.Sprite.from(resolvedTexture.start);
            finish = PIXI.Sprite.from(resolvedTexture.finish);

            turn = PIXI.Sprite.from(resolvedTexture.turn);

        


            setup();
        });


    });

function setup() {
    let stage = app.stage;
    app.ticker.add(gameLoop);


    stage.addChild(straight1);
    stage.addChild(straight2)
    stage.addChild(straight3);
    stage.addChild(turn);
    stage.addChild(start);
    stage.addChild(finish);

    stage.addChild(car);


    car.anchor.set(0.5);
    car.width = 32;
    car.height = 32
    car.x = app.screen.width / 2;
    car.y = app.screen.height / 2 + 30;

    straight1.anchor.set(0.5);
    straight1.x = app.screen.width / 2;
    straight1.y = app.screen.height / 2 - 40;
    straight1.scale.x = .25;
    straight1.scale.y = .25;
    straight1.angle = 90;

    turn.anchor.set(0.5);
    turn.x = app.screen.width / 2 + 1;
    turn.y = app.screen.height / 2 - 179;
    turn.scale.x = .25;
    turn.scale.y = .25;
    turn.angle = 90;

    straight2.anchor.set(0.5);
    straight2.x = app.screen.width / 2 + 139;
    straight2.y = app.screen.height / 2 - 179;
    straight2.scale.x = .25;
    straight2.scale.y = .25;

    straight3.anchor.set(0.5);
    straight3.x = app.screen.width / 2 + 267;
    straight3.y = app.screen.height / 2 - 179;
    straight3.scale.x = .25;
    straight3.scale.y = .25;

    start.anchor.set(0.5);
    start.x = app.screen.width / 2;
    start.y = app.screen.height / 2;
    start.scale.x = .0625;
    start.scale.y = .0625;

    finish.anchor.set(0.5);
    finish.x = app.screen.width / 2 + 305;
    finish.y = app.screen.height / 2 - 179;
    finish.scale.x = .0625;
    finish.scale.y = .0625;
    finish.angle = 90;

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
