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
    let lap = 0;
    checknum = 0;

    // Checkpoints
    let check1;
    let check2;
    let check3; 
    let check4;


    /*let engineSound = new Howl({
        src: ['sounds/engine-6000.mp3']
    });*/

    // Canvas is appended to page after the page loads
    window.onload = function() {
        document.querySelector("div").appendChild(app.view);
        window.addEventListener("keydown", keysDown);
        window.addEventListener("keyup", keysUp);
    }

   

    function keysDown(e) {
        //console.log(e.keyCode);
        keys[e.keyCode] = true;
    }
    function keysUp(e) {
        //console.log(e.keyCode);
        keys[e.keyCode] = false;
    }



   
    let carAsset;
    let startAsset;
    let finishAsset;
    let straightAsset;
    let turnAsset;
    let turnAsset2;
    let swerveAsset;
    let shortAsset;
    let shrinkAsset;
    let roadTiles = [];
    let roadRect = [];

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


    roadTiles = [
    // Common Tracks
    new Road(stage, straightAsset, 0.5, xMid - 460, yMid - 65, .25, .25, 90),
    new Road(stage, straightAsset, 0.5, xMid - 321, yMid - 204, -.25, -.25),
    new Road(stage, straightAsset, 0.5, xMid - 193, yMid - 204, .25, .25),
    new Road(stage, swerveAsset, 0.5, xMid - 33, yMid - 236, .25, -.25),
    new Road(stage, shortAsset, 0.5, xMid + 395, yMid - 267, .25, -.25),
    new Road(stage, straightAsset, 0.5, xMid + 502, yMid - 128, .25, -.25, 90),
    new Road(stage, shrinkAsset, 0.5, xMid + 502, yMid, .25, -.25, 90),
    new Road(stage, shrinkAsset, 0.5, xMid + 502, yMid + 128, .25, -.25, -90),
    new Road(stage, swerveAsset, 0.5, xMid + 331, yMid + 235, .25, .25),
    new Road(stage, shortAsset, 0.5, xMid + 203, yMid + 203, .25, .25),
    new Road(stage, swerveAsset, 0.5, xMid + 75, yMid + 171, .25, .25, 180),
    new Road(stage, swerveAsset, 0.5, xMid - 117, yMid + 107, .25, .25),
    new Road(stage, shortAsset, 0.5, xMid - 417, yMid + 266, -.25, -.25),
    new Road(stage, shortAsset, 0.5, xMid - 288, yMid + 183, .25, .25, 90),
    new Road(stage, swerveAsset, 0.5, xMid - 492, yMid + 95, .25, .25, 90),
    new Road(stage, shortAsset, 0.5, xMid - 390, yMid + 266, .25, -.25),

    // Turns
    new Road(stage, turnAsset, 0.5, xMid - 459, yMid - 204, .25, .25, 90),
    new Road(stage, turnAsset, 0.5, xMid + 139, yMid - 118, .25, -.25, -90),
    new Road(stage, turnAsset, 0.5, xMid + 288, yMid - 118, -.25, .25),
    new Road(stage, turnAsset, 0.5, xMid + 289, yMid - 267, .25, .25, 90),
    new Road(stage, turnAsset, 0.5, xMid + 502, yMid - 266, .25, .25, 180),
    new Road(stage, turnAsset2, 0.5, xMid + 138, yMid - 268, .25, .25, 90),
    new Road(stage, turnAsset, 0.5, xMid + 502, yMid + 266, -.25, .25),
    new Road(stage, turnAsset2, 0.5, xMid - 288, yMid + 76, -.25, -.25, -180),
    new Road(stage, turnAsset, 0.5, xMid - 524, yMid + 265, .25, .25),
    new Road(stage, turnAsset2, 0.5, xMid - 288, yMid + 265, .25, .25, 180),    

    // Track Marks
    new Road(stage, startAsset, 0.5, xMid - 460, yMid - 25 , .0625, .0625)]


    // Makes a rectangle of each road tile for calculations
    for (let i = 0; i < roadTiles.length; i++) {
        roadRect.push(new PIXI.Rectangle(roadTiles[i].x, roadTiles[i].y, roadTiles[i].sprite.width, roadTiles[i].sprite.height));
    }

    // Car
    addObject(stage, car, 0.5, xMid - 460, yMid + 16);
    car.width = 32;
    car.height = 32;



    // Track border Hitboxes
    collidables.push(new PIXI.Rectangle(220, 70, 340, 22));
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
    collidables.push(new PIXI.Rectangle(1205, 75, 25, 300));
    collidables.push(new PIXI.Rectangle(1205, 450, 25, 150));
    collidables.push(new PIXI.Rectangle(1190, 380, 15, 75));
    collidables.push(new PIXI.Rectangle(1175, 410, 10, 20));
    collidables.push(new PIXI.Rectangle(1055, 155, 25, 200));
    collidables.push(new PIXI.Rectangle(1055, 450, 25, 90));
    collidables.push(new PIXI.Rectangle(1070, 370, 15, 70));
    collidables.push(new PIXI.Rectangle(1095, 410, 10, 20));
    collidables.push(new PIXI.Rectangle(1195, 600, 20, 35));
    collidables.push(new PIXI.Rectangle(1125, 675, 25, 30));
    collidables.push(new PIXI.Rectangle(1150, 660, 25, 30));
    collidables.push(new PIXI.Rectangle(1175, 635, 25, 50));
    collidables.push(new PIXI.Rectangle(1000, 690, 125, 22));
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
    collidables.push(new PIXI.Rectangle(425, 351, 60, 22));
    collidables.push(new PIXI.Rectangle(485, 361, 25, 22));
    collidables.push(new PIXI.Rectangle(510, 381, 25, 22));
    collidables.push(new PIXI.Rectangle(535, 401, 25, 22));
    collidables.push(new PIXI.Rectangle(560, 413, 120, 22));
    collidables.push(new PIXI.Rectangle(680, 426, 25, 22));
    collidables.push(new PIXI.Rectangle(705, 446, 25, 22));
    collidables.push(new PIXI.Rectangle(730, 466, 25, 22));
    collidables.push(new PIXI.Rectangle(755, 476, 170, 22));
    collidables.push(new PIXI.Rectangle(925, 486, 25, 22));
    collidables.push(new PIXI.Rectangle(950, 501, 25, 22));
    collidables.push(new PIXI.Rectangle(975, 521, 30, 22));
    collidables.push(new PIXI.Rectangle(1005, 540, 74, 22));
    collidables.push(new PIXI.Rectangle(415, 522, 22, 80));
    collidables.push(new PIXI.Rectangle(405, 602, 22, 40));
    collidables.push(new PIXI.Rectangle(383, 635, 22, 25));
    collidables.push(new PIXI.Rectangle(358, 660, 25, 25));
    collidables.push(new PIXI.Rectangle(333, 675, 25, 25));
    collidables.push(new PIXI.Rectangle(150, 688, 183, 25));
    collidables.push(new PIXI.Rectangle(125, 680, 25, 25));
    collidables.push(new PIXI.Rectangle(100, 670, 25, 25));
    collidables.push(new PIXI.Rectangle(75, 655, 25, 25));
    collidables.push(new PIXI.Rectangle(50, 625, 25, 25));
    collidables.push(new PIXI.Rectangle(180, 500, 22, 60));
    collidables.push(new PIXI.Rectangle(190, 480, 22, 20));
    collidables.push(new PIXI.Rectangle(205, 460, 22, 20));
    collidables.push(new PIXI.Rectangle(220, 440, 22, 20));
    collidables.push(new PIXI.Rectangle(235, 420, 22, 20));
    collidables.push(new PIXI.Rectangle(245, 220, 22, 200));
    collidables.push(new PIXI.Rectangle(202, 540, 85, 22));
    collidables.push(new PIXI.Rectangle(30, 500, 22, 122));
    collidables.push(new PIXI.Rectangle(40, 480, 22, 20));
    collidables.push(new PIXI.Rectangle(50, 460, 22, 20));
    collidables.push(new PIXI.Rectangle(65, 440, 22, 20));
    collidables.push(new PIXI.Rectangle(80, 420, 22, 20));
    collidables.push(new PIXI.Rectangle(95, 220, 22, 200));
    collidables.push(new PIXI.Rectangle(98, 160, 22, 60));
    collidables.push(new PIXI.Rectangle(120, 130, 22, 28));
    collidables.push(new PIXI.Rectangle(142, 100, 22, 28));
    collidables.push(new PIXI.Rectangle(164, 85, 22, 28));
    collidables.push(new PIXI.Rectangle(186, 75, 34, 24));
    collidables.push(new PIXI.Rectangle(267, 220, 293, 22));
    collidables.push(new PIXI.Rectangle(560, 212, 20, 30));
    collidables.push(new PIXI.Rectangle(580, 200, 20, 30));
    collidables.push(new PIXI.Rectangle(600, 187, 20, 30));
    collidables.push(new PIXI.Rectangle(620, 172, 20, 30));
    collidables.push(new PIXI.Rectangle(640, 160, 74, 22));
    collidables.push(new PIXI.Rectangle(267, 450, 22, 90));
    collidables.push(new PIXI.Rectangle(287, 420, 22, 25));
    collidables.push(new PIXI.Rectangle(305, 390, 22, 25));
    collidables.push(new PIXI.Rectangle(330, 370, 22, 25));
    collidables.push(new PIXI.Rectangle(355, 355, 22, 25));
    collidables.push(new PIXI.Rectangle(377, 350, 40, 23));
    collidables.push(new PIXI.Rectangle(695, 185, 22, 25));
    collidables.push(new PIXI.Rectangle(703, 210, 22, 25));
    collidables.push(new PIXI.Rectangle(715, 235, 22, 25));
    collidables.push(new PIXI.Rectangle(725, 260, 25, 25));
    collidables.push(new PIXI.Rectangle(755, 285, 25, 25));
    collidables.push(new PIXI.Rectangle(780, 305, 150, 25));
    collidables.push(new PIXI.Rectangle(930, 285, 25, 25));
    collidables.push(new PIXI.Rectangle(955, 260, 25, 25));
    collidables.push(new PIXI.Rectangle(975, 235, 22, 25));
    collidables.push(new PIXI.Rectangle(985, 210, 22, 25));
    collidables.push(new PIXI.Rectangle(995, 155, 60, 25));
    collidables.push(new PIXI.Rectangle(990, 180, 22, 25));

    check1 = new PIXI.Rectangle(120, 340, 120, 5);
    check2 = new PIXI.Rectangle(725, 60, 250, 250);
    check3 = new PIXI.Rectangle(1092, 200, 100, 400);
    check4 = new PIXI.Rectangle(300, 380, 150, 250);
    
}

function gameLoop() {
    let collide = false;
    let intersect;

    // Specific hitbox to make things not terrible as the car rotates, since it is more rectangular than square
    let carRect = new PIXI.Rectangle(car.position.x - car.width / 4 - 1, car.position.y - car.height / 4 - 1, car.width / 2 + 4, car.height / 2 + 4);

    if (carRect.x < 0) {
        if (carRect.y < 0) {
            car.position.x = 50;
            car.position.y = 50
        }
        else if (carRect.y > app.screen.height) {
            car.position.x = 50;
            car.position.y = app.screen.height - 50;
        }
        car.angle += 90;
    }
    if (carRect.y < 0) {
        car.angle += 90;
    }

    if (carRect.x > app.screen.width) {
        if (carRect.y < 0) {
            car.position.x = app.screen.width - 50;
            car.position.y = 50
        }
        else if (carRect.y > app.screen.height) {
            car.position.x = app.screen.width - 50;
            car.position.y = app.screen.height - 50;
        }
        car.angle += 90;
    }

    if (car.y > app.screen.height) {
        car.angle += 90;
    }


    trackMap(carRect);

    for (let i = 0; i < collidables.length; i++) {
        intersect = collidables[i].intersection(carRect);

        if (intersect.width != 0 || intersect.height != 0) {
            collide = true;
            break;
        }
    }

    // W
    if (keys["87"]) { // Accelerating
        // Base speed of 1.25 in rough ground
        if (collide === true && velocity > 1.25) {
            acceleration = -.16;
        }
        else {
        acceleration = .1;
        }
    }
    else if (velocity > 0) { // slowing down
        if (collide === true) {
            acceleration = -.25;
        }
        else {
        acceleration = -.05;
        }
    }
    // S
    else if (keys["83"]) { // Accelerating backward
        // Base speed of 2.25 in rough ground
        if (collide === true && velocity < -2.25) {
            acceleration = .09;
        }
        else {
        acceleration = -.12;
        }
    }
    else if (velocity < 0) {// slowing down backward
        if (collide === true) {
            acceleration = .06;
        }
        else {
        acceleration = .05;
        }
    }
    else { // Coming to a stop
        acceleration = 0;
        if (velocity < 0 && velocity > -.01) {
            velocity = 0
        }
    }

    
    

    // A
    if (keys["65"]) {
        if (velocity > 0) {}
        // Uses degrees so it's a gradual turn
        car.angle -= .1875 * Math.pow(velocity, 2);

        // Turning will slow the player down
        if (acceleration === .1 && velocity > 3.25) {
            acceleration = -.03;
        }
        else if (acceleration === -.12 && velocity < 3.5) {
            // Reversing is affected much less by turning
            acceleration = -.01;
        }
    }

    // D
    if (keys["68"]) {
        // Uses degrees so it's a gradual turn
        car.angle += .1875 * Math.pow(velocity, 2);;

        // Turning will slow the player down
        if (acceleration === .1 && velocity > 3.25) {
            acceleration = -.03;
        }
        else if (acceleration === -.12 && velocity < 3.5) {
            // Reversing is affected much less by turning
            acceleration = -.01;
        }
    }

    // Movement
    velocity += acceleration;

    if (velocity > maxSpeed) {
        velocity = maxSpeed;
    }

    if (velocity < -1 * maxSpeed * .75) {
        velocity = -1 * maxSpeed * .75;
    }

    if (Math.abs(velocity) < .05) {
        velocity = 0;
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

function trackMap(carRect) {
    let intersect;

    if (checknum == 0) {
        intersect = check1.intersection(carRect)
        if (intersect.width != 0 || intersect.height != 0) {
            checknum = 1;
            lap += 1;

            if (lap == 4) {
                console.log("Finish");
            }
        }
    }

    if (checknum == 1) {
        intersect = check2.intersection(carRect)
        if (intersect.width != 0 || intersect.height != 0) {
            checknum = 2;
        }
    }

    if (checknum == 2) {
        intersect = check3.intersection(carRect)
        if (intersect.width != 0 || intersect.height != 0) {
            checknum = 3;
        }
    }

    if (checknum == 3) {
        intersect = check4.intersection(carRect)
        if (intersect.width != 0 || intersect.height != 0) {
            checknum = 0;
        }
    }
}
