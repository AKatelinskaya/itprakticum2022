var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
}

var BOMBS = [];
var TARGETS = [];
var bullets = [];

var countOfBombs = 2;
var countOfTargets = 2;

var targetSize = 20;
var bombSize = 20;

var limit = 20;
var limitHeal = 30;
var dropHeal = false;
var limitTarget = 35;

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

var HEAL = {
    x: Math.floor(Math.random() * (GAME.width - 20)),
    y: -20,
    size: 20,
    speedy: Math.floor(Math.random() * 20 + 5),
}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

function InitObj() {
    var i = 0;
    do {
        var initX = Math.floor(Math.random() * (GAME.width - bombSize));
        var initSpeed = Math.floor(Math.random() * 20 + 5);
        BOMBS[i] = {
            x: 20 + initX,
            y: -20,
            speedy: initSpeed,
            size: 20,
        }
        TARGETS[i] = {
            x: 20 + initX,
            y: -20,
            speedy: initSpeed,
            size: 20,
            ifDestroyed: false,
        }
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

function drawTarget() {
    for (var i = 0; i < countOfTargets; i++) {
        if (!TARGETS[i].ifDestroyed) {
            canvasContext.fillStyle = "green";
            canvasContext.beginPath();
            canvasContext.arc(TARGETS[i].x, TARGETS[i].y, TARGETS[i].size, 0, Math.PI * 2);
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

function drawHeal() {
    canvasContext.fillStyle = "white";
    canvasContext.beginPath();
    canvasContext.arc(HEAL.x, HEAL.y, HEAL.size, 0, Math.PI * 2);
    canvasContext.fill()
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
        var respUpdate = (BOMBS[i].y >= GAME.height - BOMBS[i].size) && !GAME.ifLost;

        if (respUpdate) {
            BOMBS[i].y = 20;
            BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            BOMBS[i].speedy = initSpeed = Math.floor(Math.random() * 20 + 5);
            if (PLAYER.score > limitTarget) {
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
        }
        if (losePositionX && losePositionY) {
            PLAYER.lives -= 1;
            BOMBS[i].y = -20;
            BOMBS[i].x = Math.floor(Math.random() * (GAME.width - BOMBS[i].size));
            if (PLAYER.lives === 0) {
                GAME.ifLost = true;
            }
        }
        i++;
    }
    while (i < countOfBombs)
}

function updateTargets() {
    var i = 0;
    do {
        TARGETS[i].y += TARGETS[i].speedy;
        var respUpdate = (TARGETS[i].y >= GAME.height - TARGETS[i].size) && !GAME.ifLost;
        if (respUpdate) {
            TARGETS[i].y = 20;
            TARGETS[i].x = Math.floor(Math.random() * (GAME.width - TARGETS[i].size));
            TARGETS[i].speedy = initSpeed = Math.floor(Math.random() * 20 + 5);
            if (PLAYER.score > limitTarget) {
                var initX = Math.floor(Math.random() * (GAME.width - TARGETS[i].size));
                var initSpeed = Math.floor(Math.random() * 20 + 5);
                TARGETS[countOfTargets] = {
                    x: initX,
                    y: -20,
                    speedy: initSpeed,
                    size: 20,
                }
                countOfTargets++;
                limitTarget += limitTarget;
            }
        }
        i++;
    }
    while (i < countOfTargets)
}

function updateHeal() {
    if (PLAYER.score === limitHeal){
        dropHeal = true;
        limitHeal += + 25;
    }
    if (dropHeal === true) {
        HEAL.y += HEAL.speedy;
        var respUpdate = (HEAL.y >= GAME.height - HEAL.size) && !GAME.ifLost;
        var healPositionY = HEAL.y + HEAL.size / 2 >= PLAYER.y;
        var healPositionX = (HEAL.x - HEAL.size / 2 <= PLAYER.x + PLAYER.width) && (HEAL.x + HEAL.size / 2 >= PLAYER.x);
        if (respUpdate) {
            HEAL.y = -20;
            HEAL.x = Math.floor(Math.random() * (GAME.width - HEAL.size));
            HEAL.speedy = Math.floor(Math.random() * 20 + 5);
            dropHeal = false;
        }
        if (healPositionX && healPositionY && !GAME.ifLost) {
            if (PLAYER.lives < 3) {
                PLAYER.lives += 1;
            }
            HEAL.y = -20;
            HEAL.x = Math.floor(Math.random() * (GAME.width - HEAL.size));
            dropHeal = false;
        }
    }
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

function destroyTarget() {
    for (var i = 0; i < bullets.length; i++) {
        var ifTargetDestroyed = false;
        for (var j = 0; j < countOfTargets; j++) {
            var destroyTargetX = (bullets[i].x > TARGETS[j].x - TARGETS[j].size) && (bullets[i].x < TARGETS[j].x + TARGETS[j]. size);
            var destroyTargetY = (bullets[i].y <= TARGETS[j].y + TARGETS[j].size / 2);
            if (destroyTargetX && destroyTargetY) {
                var initX = Math.floor(Math.random() * (GAME.width - targetSize));
                var initSpeed = Math.floor(Math.random() * 20 + 5);
                TARGETS[j] = {
                    x: initX,
                    y: -20,
                    speedy: initSpeed,
                    size: 20,
                    ifDestroyed: false,
                }
                ifTargetDestroyed = true;
                PLAYER.score += 1;
                j--;
            }
        }
        if (ifTargetDestroyed) {
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
    drawTarget();
    drawHeal();
    drawInfoWindow();
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
        updateTargets();
        updatePlayer();
        updateHeal();
        destroyTarget();
        requestAnimationFrame(play);
    }
    else {
        alert("You lose!");
    }
}

InitObj();
initEventListeners();
play();