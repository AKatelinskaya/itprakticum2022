var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
}

var InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width
}

var PLAYER = {
    x: GAME.width * 0.45,
    y: GAME.height * 0.9,
    height: GAME.height * 0.03,
    width: GAME.width * 0.07,
    score: 0,
    lives: 3,
    speedX: 20,
}

var bombSize = 20

var BOMB = {
    x: 50,
    y: 0,
    size: bombSize,
    speedy: 20,

}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

function drawBackground() {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawPlayer() {
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

function drawBomb() {
    canvasContext.fillStyle = "black";
    canvasContext.beginPath();
    canvasContext.arc(BOMB.x, BOMB.y, BOMB.size, 0, Math.PI * 2);
    canvasContext.fill();
}

function drawInfoWindow() {
    canvasContext.fillStyle = "black";
    canvasContext.beginPath();
    canvasContext.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.fill();
    canvasContext.fillStyle = "white";
    canvasContext.font = "30px serif";
    canvasContext.fillText("Your score:", InfoWindow.x + 10, 50);
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    canvasContext.fillText("Your lives:", InfoWindow.x + 10, 120);
    canvasContext.fillText(PLAYER.lives, InfoWindow.x + 10, 155);
}

function updateBombs() {
    BOMB.y += BOMB.speedy;
    var losePositionY = BOMB.y + BOMB.size / 2 >= PLAYER.y;
    var losePositionX = (BOMB.x - BOMB.size / 2 <= PLAYER.x + PLAYER.width) && (BOMB.x + BOMB.size / 2 >= PLAYER.x);
    var scoreUpdate = (BOMB.y >= GAME.height - BOMB.size) && !GAME.ifLost;

    if (scoreUpdate) {
        BOMB.y = 20;
        BOMB.x = Math.floor(Math.random() * (GAME.width - BOMB.size));
        PLAYER.score++;
        BOMB.speedy = Math.floor(Math.random() * 20 + 5);
    }
    if (losePositionX && losePositionY && !GAME.ifLost) {
        if (PLAYER.lives === 0) {
            GAME.ifLost = true;
        } else {
            PLAYER.lives -= 1;
            BOMB.y = 0;
            BOMB.x = Math.floor(Math.random() * (GAME.width - BOMB.size));
        }
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawBomb();
    drawInfoWindow()
}

function updatePlayer() {
    if (PLAYER.x + PLAYER.width > GAME.width) {
        PLAYER.x = GAME.width - PLAYER.width;
    }
    if (PLAYER.x < 0) {
        PLAYER.x = 0;
    }
}

function initEventListeners() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown)
}

function onMouseMove(event) {
    if (event.clientX + PLAYER.width < GAME.width) {
        PLAYER.x = event.clientX;
    } else {
        PLAYER.x = GAME.width - PLAYER.width;
    }
}

function onKeyDown(event) {
    if ((event.key === "ArrowLeft") && (PLAYER.x > 0)) {
        PLAYER.x -= PLAYER.speedX;
    }
    if (event.key === "ArrowRight" && (PLAYER.x + PLAYER.width < GAME.width)) {
        PLAYER.x += PLAYER.speedX;
    }
}

function play() {
    if (GAME.ifLost === false) {
        drawFrame();
        updateBombs();
        updatePlayer();
        requestAnimationFrame(play);
    }
}

initEventListeners();
play();
