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
    let maxSpeed = 5;
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
    let startAsset;
    let finishAsset;
    let straightAsset;
    let turnAsset;
    let turnAsset2;
    let swerveAsset;

    assets.add('car', 'images/Mini_Pixel_Pack_2/Cars/Player_green_(16x16).png');
    assets.add('start', 'images/Tracks/Start.png');
    assets.add('finish', 'images/Tracks/Finish.png');
    assets.add('turn', 'images/Tracks/Road_01_Tile_01.png');
    assets.add('turn2', 'images/Tracks/Road_01_Tile_02.png');
    assets.add('straight', 'images/Tracks/Road_01_Tile_03.png');
    assets.add('swerve', 'images/Tracks/Road_01_tile_06.png');



    const loadedTextures = assets.load('car');

    // Unfortunately messy as I needed a way for car to run by itself
    loadedTextures.then((resolvedTexture) => {
        // Gets the cars sprite
        const rect = new PIXI.Rectangle(0,0,16,16);
        resolvedTexture.frame = rect;
        car = new PIXI.Sprite(resolvedTexture);

        let nextLoadedTextures = assets.load(['start', 'finish', 'turn', 'straight', 'swerve', 'turn2']);
        nextLoadedTextures.then((resolvedTexture) => {
            straightAsset = PIXI.Sprite.from(resolvedTexture.straight);
            startAsset = PIXI.Sprite.from(resolvedTexture.start);
            finishAsset = PIXI.Sprite.from(resolvedTexture.finish);
            swerveAsset = PIXI.Sprite.from(resolvedTexture.swerve);

            turnAsset = PIXI.Sprite.from(resolvedTexture.turn);
            turnAsset2 = PIXI.Sprite.from(resolvedTexture.turn2);

        


            setup();
        });


    });

function setup() {
    let stage = app.stage;
    app.ticker.add(gameLoop);
    const xMid = app.screen.width / 2;
    const yMid = app.screen.height / 2;


    // Common Tracks
    new Road(stage, straightAsset, 0.5, xMid - 500, yMid - 40, .25, .25, 90);
    new Road(stage, straightAsset, 0.5, xMid - 361, yMid - 179, -.25, -.25);
    new Road(stage, straightAsset, 0.5, xMid - 233, yMid - 179, .25, .25);

    new Road(stage, swerveAsset, 0.5, xMid - 73, yMid - 211, .25, -.25)

    // Turns
    new Road(stage, turnAsset, 0.5, xMid - 499, yMid - 179, .25, .25, 90);
    new Road(stage, turnAsset, 0.5, xMid + 99, yMid - 93, .25, -.25, -90);
    new Road(stage, turnAsset2, 0.5, xMid + 98, yMid - 243, .25, .25, 90);
    new Road(stage, turnAsset2, 0.5, xMid + 248, yMid - 93, .25, -.25, -90);

    
    // Track Marks
    new Road(stage, startAsset, 0.5, xMid - 500, yMid, .0625, .0625);
    new Road(stage, finishAsset, 0.5, xMid - 205, yMid - 179, .0625, .0625, 90);

    // Car
    addObject(stage, car, 0.5, xMid - 500, yMid - 40);
    car.width = 32;
    car.height = 32;
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
        if (acceleration === .1 && velocity > 3.5) {
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

function addObject(stage, object, anchor, x, y, scaleX = 1, scaleY = 1, rotation = 0) {
    stage.addChild(object);

    object.anchor.set(anchor);
    object.x = x;
    object.y = y;
    object.scale.x = scaleX;
    object.scale.y = scaleY;
    object.angle = rotation;
}
