let canvasSize = 750;
let roomsPerRow = 4;
let pitPercentage = 2;
let totalGold = 2;
let goldCollected = 0;
let worldAutoIncrement = false;    
let wumpusWorld;
let wumpus_image;
let wumpus_dead_image;
let gold_image;
let breeze_image;
let stench_image;
let agent_up_image;
let agent_down_image;
let agent_left_image
let agent_right_image;
let agent_walk_sprite_sheet;
let arrow_overlay_image;
let terrain_image;
let cover_image;
let victory_sound;
let defeat_sound;
let bell_sound;
let wind_sound;
let flies_sound;
let pit_image;
let loading = true;
let loadCounter = 0;
let filesToLoad = 16;
let bar;
let cheatMode = false;
let interval;
let isManualMode = true;
let isFixedBoard = true;
let totalScore = 0;
let numOfSteps = 0;
let arrowUsed = 0;
let dead = 0;

function loadAssets(callback) {
    wumpus_image = loadImage('assets/textures/wumpus1.png', callback);
    wumpus_dead_image = loadImage('assets/textures/wumpus_dead1.png', callback);
    gold_image = loadImage('assets/textures/gold.png', callback);
    breeze_image = loadImage('assets/textures/breeze1.png', callback);
    stench_image = loadImage('assets/textures/stench.png', callback);
    agent_up_image = loadImage('assets/textures/agent_up1.png', callback);
    agent_down_image = loadImage('assets/textures/agent_down1.png', callback);
    agent_left_image = loadImage('assets/textures/agent_left1.png', callback);
    agent_right_image = loadImage('assets/textures/agent_right1.png', callback);
    arrow_overlay_image = loadImage('assets/textures/arrow_overlay.png', callback)
    pit_image = loadImage('assets/textures/pit1.png', callback);
    terrain_image = loadImage('assets/textures/bgg1.jpg', callback);
    cover_image = loadImage('assets/textures/bg.jpg', callback);
    // cover_image = createImg('assets/textures/abc.gif', callback);
    bell_sound = loadSound('assets/sounds/bell.wav', callback);
    victory_sound = loadSound('assets/sounds/victory.wav', callback);
    defeat_sound = loadSound('assets/sounds/lose.wav', callback);
    wind_sound = [loadSound('assets/sounds/wind.wav', callback),
        loadSound('assets/sounds/wind2.wav', callback),
        loadSound('assets/sounds/wind3.wav', callback)
    ];
    flies_sound = loadSound('assets/sounds/flies.wav', callback);
    flies_sound.setVolume(0.5);
}

function loadCallback() {
    loadCounter++;
    bar.next();
    if (loadCounter == filesToLoad) {
        loading = false;
    }
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.id("wumpus-world-canvas");
    canvas.parent("canvas-container");
    bar = new ProgressBar(filesToLoad);
    loadAssets(loadCallback);
    wumpusWorld = new World(roomsPerRow, pitPercentage, totalGold);
    updateVolume();
    updatePitPercentage();
    updateGoldNumber();
}

function restart() {
    clearInterval(interval);
    isManualMode = true;
    cheatMode=false;
    totalScore = 0;
    numOfSteps = 0;
    arrowUsed = 0;
    dead = 0;
    goldCollected = 0;
    wumpusWorld = new World(roomsPerRow, pitPercentage, totalGold);
    flies_sound.stop();
    wind_sound.forEach(sound => {
        sound.stop();
    });
    victory_sound.stop();
    defeat_sound.stop();
}

function draw() {
    if (loading) {
        background(100);
        smooth();
        bar.display();
    } else {
        background(255);
        smooth();
        wumpusWorld.display();
    }
}

function randomRestart() {
    isFixedBoard = false;
    restart();
    
}

function fixedRestart() {
    isFixedBoard = true;
    restart();    
}

function keyPressed() {
    // console.log(keyCode);
    if (keyCode === UP_ARROW || keyCode === 87) {
        wumpusWorld.agent.up();
    } else if (keyCode === DOWN_ARROW || keyCode === 83) {
        wumpusWorld.agent.down();
    } else if (keyCode === LEFT_ARROW || keyCode === 65) {
        wumpusWorld.agent.left();
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        wumpusWorld.agent.right();
    } else if (keyCode == ENTER) {
        if (wumpusWorld.agent.alive && wumpusWorld.wumpus.alive) {
            wumpusWorld.agent.shoot();
        } else {
            restart();
        }
    } else if (keyCode == 32) {
        restart();
    }


    wumpusWorld.rooms.forEach(row => {
        row.forEach(room => {
            room.containsAgent = false;
        });
        wumpusWorld.agent.getCurrentRoom().containsAgent = true;
    });

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function cheat() {
    cheatMode = ! cheatMode;
    if(cheatMode) {
        wumpusWorld.showAllRooms();
    }
    else {
        wumpusWorld.hideRooms();
    }
}
function simulate () {
    simulator = new Simulate(wumpusWorld);

    simulator.play();
}