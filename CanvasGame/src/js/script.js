var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
}

var BOMBS = [];
var bullets = [];

var countOfBombs = 2;
var bombSize = 20;

var limit = 20;

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
            ifDestroyed: false,
        }
        console.log(i);
        i++;
    }
    while (i < countOfBombs)
}

function initBullets() {
    var BULLET = {
        x: PLAYER.x + PLAYER.width / 2,
        y: PLAYER.y - 10,
        width: 5,
        height: 10,
        speedy: -10,
    }
    bullets.push(BULLET);
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
        if (!BOMBS[i].ifDestroyed) {
            canvasContext.fillStyle = "black";
            canvasContext.beginPath();
            canvasContext.arc(BOMBS[i].x, BOMBS[i].y, BOMBS[i].size, 0, Math.PI * 2);
            canvasContext.fill();
        }
    }
}

function drawBullets() {
    for (var i = 0; i < bullets.length; i++) {
        canvasContext.fillStyle = "black";
        canvasContext.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
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

function updateBombs() {
    var i = 0;
    do {
        BOMBS[i].y += BOMBS[i].speedy;
        var losePositionY = BOMBS[i].y + BOMBS[i].size / 2 >= PLAYER.y;
        var losePositionX = (BOMBS[i].x - BOMBS[i].size / 2 <= PLAYER.x + PLAYER.width) && (BOMBS[i].x + BOMBS[i].size / 2 >= PLAYER.x);
        var scoreUpdate = (BOMBS[i].y >= GAME.height - BOMBS[i].size) && !GAME.ifLost;

        if (scoreUpdate) {
            BOMBS[i].y = 20;
            BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            PLAYER.score++;
            BOMBS[i].speedy = 5;
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
            if (PLAYER.lives === 0) {
                GAME.ifLost = true;
            } else {
                PLAYER.lives -= 1;
                BOMBS[i].y = 0;
                BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            }
        }
        i++;
    }
    while (i < countOfBombs)
}

function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].y += bullets[i].speedy;
        if (bullets[i].y < 0)
            bullets.splice(i, 1);
    }
}

function updatePlayer() {
    if (PLAYER.x + PLAYER.width > GAME.width) {
        PLAYER.x = GAME.width - PLAYER.width;
    }
    if (PLAYER.x < 0) {
        PLAYER.x = 0;
    }
}

function destroyBomb() {
    for (var i = 0; i < bullets.length; i++) {
        var ifBombDestoyed = false;
        for (var j = 0; j < countOfBombs; j++) {
            var destroyBombX = (bullets[i].x > BOMBS[j].x - BOMBS[j].size) && (bullets[i].x < BOMBS[j].x + BOMBS[j]. size);
            var destroyBombY = (bullets[i].y <= BOMBS[j].y + BOMBS[j].size / 2);
            // console.log(bullets[i]);
            console.log(destroyBombX)
            if (destroyBombX) console.log("X");
            if (destroyBombX && destroyBombY) {
                var initX = Math.floor(Math.random() * (GAME.width - bombSize));
                var initSpeed = Math.floor(Math.random() * 20 + 5);
                BOMBS[j] = {
                    x: initX,
                    y: 0,
                    speedy: initSpeed,
                    size: 20,
                    ifDestroyed: false,
                }
                ifBombDestoyed = true;
                j--;
                console.log("boom!")
            }
        }
        if (ifBombDestoyed) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawBomb();
    drawBullets();
    drawInfoWindow()
}


function initEventListeners() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onMouseClick);
}

function onMouseMove(event) {
    if (event.clientX + PLAYER.width < GAME.width) {
        PLAYER.x = event.clientX - PLAYER.width / 2;
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

function onMouseClick() {
    if (GAME.ifLost === false) {
        initBullets();
        drawBullets();
    }
}

function play() {
    if (GAME.ifLost === false) {
        drawFrame();
        updateBombs();
        updateBullets();
        updatePlayer();
        destroyBomb();
        requestAnimationFrame(play);
    }
    else {
        alert("You lose!");
    }
}

InitBombs();
initEventListeners();
play();