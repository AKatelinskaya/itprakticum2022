var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
}

var PLAYER = {
    x: GAME.width * 0.45,
    y: GAME.height * 0.9,
    height: GAME.height * 0.03,
    width: GAME.width * 0.07,
    score: 0,
}

var BOMB = {
    x: 50,
    y: 50,
    speedy: 20,
    size: 25,
}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width;
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

function updateBomb() {
    var losePositionY = BOMB.y + BOMB.size / 2 >= PLAYER.y;
    var losePositionX = (BOMB.x - BOMB.size / 2 <= PLAYER.x + PLAYER.width) && (BOMB.x + BOMB.size / 2 >= PLAYER.x);
    var scoreUpdate = (BOMB.y >= GAME.height - BOMB.size) && !GAME.ifLost;
    BOMB.y += BOMB.speedy;
    if (scoreUpdate) {
        BOMB.y = 0;
        BOMB.x = Math.floor(Math.random() * (GAME.width - BOMB.size));
        PLAYER.score++;
        console.log("score: " + PLAYER.score);
    }
    if (losePositionX && losePositionY && !GAME.ifLost) {
        GAME.ifLost = true;
        alert("lose!");
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawBomb();
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
}

function onMouseMove(event) {
    if (event.clientX + PLAYER.width < GAME.width) {
        PLAYER.x = event.clientX;
    }
    else {
        PLAYER.x = GAME.width - PLAYER.width;
    }
}

function play() {
    drawFrame();
    updateBomb();
    updatePlayer();
    requestAnimationFrame(play);
}

initEventListeners();
play();