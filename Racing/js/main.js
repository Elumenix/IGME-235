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
    let collidables = [];


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
    let shortAsset;
    let shrinkAsset;

    assets.add('car', 'images/Mini_Pixel_Pack_2/Cars/Player_green_(16x16).png');
    assets.add('start', 'images/Tracks/Start.png');
    assets.add('finish', 'images/Tracks/Finish.png');
    assets.add('turn', 'images/Tracks/Road_01_Tile_01.png');
    assets.add('turn2', 'images/Tracks/Road_01_Tile_02.png');
    assets.add('straight', 'images/Tracks/Road_01_Tile_03.png');
    assets.add('swerve', 'images/Tracks/Road_01_tile_06.png');
    assets.add('short', 'images/Tracks/Road_01_tile_07.png');
    assets.add('shrink', 'images/Tracks/Road_01_tile_08.png')




    const loadedTextures = assets.load('car');

    // Unfortunately messy as I needed a way for car to run by itself
    loadedTextures.then((resolvedTexture) => {
        // Gets the cars sprite
        const rect = new PIXI.Rectangle(0,0,16,16);
        resolvedTexture.frame = rect;
        car = new PIXI.Sprite(resolvedTexture);

        let nextLoadedTextures = assets.load(['start', 'finish', 'turn', 'straight', 'swerve', 'turn2', 'short', 'shrink']);
        nextLoadedTextures.then((resolvedTexture) => {
            straightAsset = PIXI.Sprite.from(resolvedTexture.straight);
            startAsset = PIXI.Sprite.from(resolvedTexture.start);
            finishAsset = PIXI.Sprite.from(resolvedTexture.finish);
            shortAsset = PIXI.Sprite.from (resolvedTexture.short)
            swerveAsset = PIXI.Sprite.from(resolvedTexture.swerve);
            shrinkAsset = PIXI.Sprite.from(resolvedTexture.shrink);


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
    new Road(stage, straightAsset, 0.5, xMid - 460, yMid - 65, .25, .25, 90);
    new Road(stage, straightAsset, 0.5, xMid - 321, yMid - 204, -.25, -.25);
    new Road(stage, straightAsset, 0.5, xMid - 193, yMid - 204, .25, .25);
    new Road(stage, swerveAsset, 0.5, xMid - 33, yMid - 236, .25, -.25);
    new Road(stage, shortAsset, 0.5, xMid + 395, yMid - 267, .25, -.25);
    new Road(stage, straightAsset, 0.5, xMid + 502, yMid - 128, .25, -.25, 90);
    new Road(stage, shrinkAsset, 0.5, xMid + 502, yMid, .25, -.25, 90);
    new Road(stage, shrinkAsset, 0.5, xMid + 502, yMid + 128, .25, -.25, -90);
    new Road(stage, swerveAsset, 0.5, xMid + 331, yMid + 235, .25, .25);
    new Road(stage, shortAsset, 0.5, xMid + 203, yMid + 203, .25, .25);
    new Road(stage, swerveAsset, 0.5, xMid + 75, yMid + 171, .25, .25, 180);
    new Road(stage, swerveAsset, 0.5, xMid - 117, yMid + 107, .25, .25);
    new Road(stage, shortAsset, 0.5, xMid - 417, yMid + 266, -.25, -.25);
    new Road(stage, shortAsset, 0.5, xMid - 288, yMid + 183, .25, .25, 90);
    new Road(stage, swerveAsset, 0.5, xMid - 492, yMid + 95, .25, .25, 90);
    new Road(stage, shortAsset, 0.5, xMid - 390, yMid + 266, .25, -.25);



    // Turns
    new Road(stage, turnAsset, 0.5, xMid - 459, yMid - 204, .25, .25, 90);
    new Road(stage, turnAsset, 0.5, xMid + 139, yMid - 118, .25, -.25, -90);
    new Road(stage, turnAsset, 0.5, xMid + 288, yMid - 118, -.25, .25);
    new Road(stage, turnAsset, 0.5, xMid + 289, yMid - 267, .25, .25, 90);
    new Road(stage, turnAsset, 0.5, xMid + 502, yMid - 266, .25, .25, 180);
    new Road(stage, turnAsset2, 0.5, xMid + 138, yMid - 268, .25, .25, 90);
    new Road(stage, turnAsset, 0.5, xMid + 502, yMid + 266, -.25, .25);
    new Road(stage, turnAsset2, 0.5, xMid - 288, yMid + 76, -.25, -.25, -180);
    new Road(stage, turnAsset, 0.5, xMid - 524, yMid + 265, .25, .25);
    new Road(stage, turnAsset2, 0.5, xMid - 288, yMid + 265, .25, .25, 180);

    
    
    // Track Marks
    new Road(stage, startAsset, 0.5, xMid - 460, yMid - 25 , .0625, .0625);
    //new Road(stage, finishAsset, 0.5, xMid - 165, yMid - 199, .0625, .0625, 90);

    // Car
    addObject(stage, car, 0.5, xMid - 460, yMid + 16);
    car.width = 32;
    car.height = 32;

    // temp
    var graphics = new PIXI.Graphics();
    //graphics.beginFill(0xFFFF00);
    graphics.lineStyle(1, 0xFF0000);

    collidables.push(new PIXI.Rectangle(250, 70, 310, 22));
    collidables.push(new PIXI.Rectangle(560, 50, 20, 30));
    collidables.push(new PIXI.Rectangle(580, 38, 20, 30));
    collidables.push(new PIXI.Rectangle(600, 20, 20, 30));
    collidables.push(new PIXI.Rectangle(620, 10, 20, 30));
    collidables.push(new PIXI.Rectangle(640, 6, 120, 22));
    collidables.push(new PIXI.Rectangle(760, 6, 25, 30));
    collidables.push(new PIXI.Rectangle(785, 25, 25, 30));
    collidables.push(new PIXI.Rectangle(810, 45, 30, 35));
    collidables.push(new PIXI.Rectangle(842, 118, 25, 60));
    collidables.push(new PIXI.Rectangle(830, 90, 50, 20));
    collidables.push(new PIXI.Rectangle(900, 25, 25, 30));
    collidables.push(new PIXI.Rectangle(870, 45, 30, 35));
    collidables.push(new PIXI.Rectangle(925, 6, 25, 30));
    collidables.push(new PIXI.Rectangle(950, 6, 175, 22));
    collidables.push(new PIXI.Rectangle(1125, 10, 25, 30));
    collidables.push(new PIXI.Rectangle(1150, 25, 25, 30));
    collidables.push(new PIXI.Rectangle(1175, 30, 25, 50));

    // Copy these for  hairpin
    collidables.push(new PIXI.Rectangle(1205, 75, 25, 300));
    collidables.push(new PIXI.Rectangle(1205, 450, 25, 150));
    collidables.push(new PIXI.Rectangle(1190, 380, 15, 75));
    collidables.push(new PIXI.Rectangle(1175, 410, 10, 20));

    collidables.push(new PIXI.Rectangle(1195, 600, 20, 35));
    collidables.push(new PIXI.Rectangle(1125, 675, 25, 30));
    collidables.push(new PIXI.Rectangle(1150, 660, 25, 30));
    collidables.push(new PIXI.Rectangle(1175, 635, 25, 50));
    collidables.push(new PIXI.Rectangle(1000, 690, 125, 22));


    // Curvy Section
    collidables.push(new PIXI.Rectangle(415, 500, 60, 22));
    collidables.push(new PIXI.Rectangle(475, 510, 25, 22));
    collidables.push(new PIXI.Rectangle(500, 530, 25, 22));
    collidables.push(new PIXI.Rectangle(525, 550, 25, 22));
    collidables.push(new PIXI.Rectangle(550, 562, 120, 22));
    collidables.push(new PIXI.Rectangle(670, 575, 25, 22));
    collidables.push(new PIXI.Rectangle(695, 595, 25, 22));
    collidables.push(new PIXI.Rectangle(720, 615, 25, 22));
    collidables.push(new PIXI.Rectangle(745, 625, 170, 22));
    collidables.push(new PIXI.Rectangle(915, 635, 25, 22));
    collidables.push(new PIXI.Rectangle(940, 650, 25, 22));
    collidables.push(new PIXI.Rectangle(965, 670, 30, 22));

    collidables.push(new PIXI.Rectangle(415, 522, 22, 80));
    collidables.push(new PIXI.Rectangle(405, 602, 22, 40));
    collidables.push(new PIXI.Rectangle(383, 635, 22, 25));
    collidables.push(new PIXI.Rectangle(358, 660, 25, 25));


    // Inside Swerve
    collidables.push(new PIXI.Rectangle(180, 500, 22, 60));
    collidables.push(new PIXI.Rectangle(190, 480, 22, 20));
    collidables.push(new PIXI.Rectangle(205, 460, 22, 20));
    collidables.push(new PIXI.Rectangle(220, 440, 22, 20));
    collidables.push(new PIXI.Rectangle(235, 420, 22, 20));
    collidables.push(new PIXI.Rectangle(245, 220, 22, 200));

    collidables.push(new PIXI.Rectangle(30, 500, 22, 60));
    collidables.push(new PIXI.Rectangle(40, 480, 22, 20));
    collidables.push(new PIXI.Rectangle(50, 460, 22, 20));
    collidables.push(new PIXI.Rectangle(65, 440, 22, 20));
    collidables.push(new PIXI.Rectangle(80, 420, 22, 20));
    collidables.push(new PIXI.Rectangle(95, 220, 22, 200));






































    stage.addChild[collidables[0]];
    
    for (let i = 0; i < collidables.length; i++) {
        graphics.drawRect(collidables[i].x, collidables[i].y, collidables[i].width, collidables[i].height);
    }

    stage.addChild(graphics);
    
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
