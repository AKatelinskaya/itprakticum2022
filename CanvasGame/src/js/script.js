var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
}

var BOMBS = [];

var countOfBombs = 2;
var bombSize = 20;

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

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

function InitBombs() {
    var i = 0;
    do {
        var initX = Math.floor(Math.random() * (GAME.width - bombSize));
        var initSpeed = Math.floor(Math.random() * 20 + 5);
        BOMBS[i] = {
            x: initX,
            y: -20,
            speedy: initSpeed,
            size: 20,
        }
        console.log(i);
        i++;
    }
    while (i < countOfBombs)
}

function drawBackground() {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawPlayer() {
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

function drawBomb() {
    for (var i = 0; i < countOfBombs; i++) {
        canvasContext.fillStyle = "black";
        canvasContext.beginPath();
        canvasContext.arc(BOMBS[i].x, BOMBS[i].y, BOMBS[i].size, 0, Math.PI * 2);
        canvasContext.fill();
    }
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

var limit = 20;

function updateBombs() {
    var i = 0;
    do {
        BOMBS[i].y += BOMBS[i].speedy;
        var losePositionY = BOMBS[i].y + BOMBS[i].size / 2 >= PLAYER.y;
        var losePositionX = (BOMBS[i].x - BOMBS[i].size / 2 <= PLAYER.x + PLAYER.width) && (BOMBS[i].x + BOMBS[i].size / 2 >= PLAYER.x);
        var scoreUpdate = (BOMBS[i].y >= GAME.height - BOMBS[i].size) && !GAME.ifLost;
        var updateBomb = (BOMBS[i].y >= GAME.height)

        if (scoreUpdate) {
            BOMBS[i].y = 20;
            BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            PLAYER.score++;
            BOMBS[i].speedy = Math.floor(Math.random() * 20 + 5);
            if (PLAYER.score > limit) {
                var initX = Math.floor(Math.random() * (GAME.width - bombSize));
                var initSpeed = Math.floor(Math.random() * 20 + 5);
                BOMBS[countOfBombs] = {
                    x: initX,
                    y: -20,
                    speedy: initSpeed,
                    size: 20,
                }
                countOfBombs++;
                limit += limit;
            }
            console.log("score: " + PLAYER.score);
        }
        if (losePositionX && losePositionY && !GAME.ifLost) {
            PLAYER.lives -= 1;
            BOMBS[i].y = 0;
            BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            if (PLAYER.lives === 0) {
                GAME.ifLost = true;
            }
        }
        i++;
    }
    while (i < countOfBombs)
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
    } else {
        drawFrame();
        alert("You lose!");
    }
}

InitBombs();
initEventListeners();
play();