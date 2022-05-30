//Создаем экран, задаем размеры окна с игрой, добавляем переменную для проверки поражения, задаем цвет фона
var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
    backgroundColor: "#21007E",
    background: null,
}

var ENEMY = {
    width: 222,
    height: 122,
    nlo: null,
}

//Добавляем окно с доп. информацией(жизни и очки), задаем ширину, длинну, положение на экране, задаем цвет фона и текста
var InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width,
    backgroundColor: "black",
    textColor: "white",
    livex: 610,
    livey: 135,
}

//Создаем игрока, адаптируем размеры и положение под экран, добавляем переменные счетчика очков, жизней, также даем игроку скорость, цвет
var PLAYER = {
    x: GAME.width * 0.45,
    y: GAME.height - 136,
    height: 134,
    width: 53,
    score: 0,
    lives: 3,
    speedX: 20,
    color: "white",
    hero: null,
    live: null,
}

//Добавляем константы для случайно генерации бомд
var maxSize = 50;
var maxSpeed = 12;
var minSpeed  = 10;
var minSize = 30;

//Создаем бомбу, случайное расположение по экрану, случайный размер, положение за экраном, случайная скорость и указываем цвет
var BOMB = {
    x: Math.floor(Math.random() * (GAME.width - maxSize)),
    y: ENEMY.height + maxSize,
    width: Math.floor(Math.random() * maxSize + 20),
    speedy: Math.floor(Math.random() * maxSpeed + 5),
    color: "black",
    meteor: null,
}

//Создание инструментов рисования и разметки границ холста
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

let nlo = new Image(),
    background = new Image(),
    meteor = new Image(),
    hero = new Image(),
    live = new Image();

nlo.src = '../img/nlo.png';
background.src = '../img/bg.png';
meteor.src = '../img/meteor.png';
hero.src = '../img/hero.png';
live.src = '../img/live.png';

nlo.onload = function () {
    ENEMY.nlo = nlo;
}

background.onload = function () {
    GAME.background = background;
}

meteor.onload = function () {
    BOMB.meteor = meteor;
}

hero.onload = function () {
    PLAYER.hero = hero;
}

live.onload = function () {
    PLAYER.live = live;
}

//Отрисовка фона
function drawBackground() {
    if (GAME.background) {
        canvasContext.drawImage(GAME.background, 0, 0);
    }
}

//Отрисовываем игрока
function drawPlayer() {
    if (PLAYER.hero) {
        canvasContext.drawImage(PLAYER.hero, PLAYER.x, PLAYER.y)
    }
}

function drawEnemy() {
    if (ENEMY.nlo) {
        canvasContext.drawImage(ENEMY.nlo, (GAME.width - ENEMY.width) / 2, 0, 222, 122);
    }
}

//Отрисовываем бомбу
function drawBomb() {
    if (BOMB.meteor) {
        canvasContext.drawImage(BOMB.meteor, BOMB.x, BOMB.y, BOMB.width, BOMB.width * 1.7);
    }
}

//Отрисовываем окно для вывода доп. данных и выводим там сами данные
function drawInfoWindow() {
    canvasContext.fillStyle = InfoWindow.backgroundColor;
    canvasContext.beginPath();
    canvasContext.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.fill();
    canvasContext.font = '30px Montserrat';
    canvasContext.fillStyle = InfoWindow.textColor;
    canvasContext.fillText("Your score:", InfoWindow.x + 10, 50);
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    canvasContext.fillText("Your lives:", InfoWindow.livex, 120);
}

function drawLives() {
    if (PLAYER.live) {
        for (let i = 0; i < PLAYER.lives; i++) {
            canvasContext.drawImage(PLAYER.live, InfoWindow.livex + i * 35, InfoWindow.livey);
        }
    }
}

//Создаем процедуру случайной генерации бомбы после ее падения или столкновения
function respawnBomb(){
    BOMB.width = Math.floor(Math.random() * maxSize + minSize);
    BOMB.y = ENEMY.height + BOMB.width;
    BOMB.x = Math.floor(Math.random() * (GAME.width - BOMB.width));
    BOMB.speedy = Math.floor(Math.random() * maxSpeed + minSpeed);
}

//Процедура движения бомбы по экрану и проверки на столкновения
function updateBombs() {
    BOMB.y += BOMB.speedy;
    var losePositionY = BOMB.y + BOMB.width >= PLAYER.y;
    var losePositionX = (BOMB.x <= PLAYER.x + PLAYER.width) && (BOMB.x + BOMB.width >= PLAYER.x);
    var scoreUpdate = (BOMB.y >= GAME.height + BOMB.width) && !GAME.ifLost;
    if (scoreUpdate) {
        respawnBomb();
        PLAYER.score++;
    }
    if (losePositionX && losePositionY) {
        respawnBomb();
        PLAYER.lives -= 1;
        if (PLAYER.lives === 0) {
            GAME.ifLost = true;
        }
    }
}

//Стираем экран и вызываем процедуры отрисовки всех обьектов
function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    if (GAME.ifLost === false)
        drawBomb();
    drawEnemy();
    drawInfoWindow();
    drawLives();
}

//Двигаем игрока и проверяем выходит ли он за границы
function updatePlayer() {
    if (PLAYER.x + PLAYER.width > GAME.width) {
        PLAYER.x = GAME.width - PLAYER.width;
    }
    if (PLAYER.x < 0) {
        PLAYER.x = 0;
    }
}

//Иницилизируем функции работы с клавиатурой и мышью
function initEventListeners() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown)
}

//Присваиваем координату x курсора игроку
function onMouseMove(event) {
    if ((event.clientX + PLAYER.width < GAME.width) && (event.clientX - PLAYER.width / 2 > 0)) {
        PLAYER.x = event.clientX - PLAYER.width / 2;
    } else {
        if ((event.clientX + PLAYER.width > GAME.width)){
            PLAYER.x = GAME.width - PLAYER.width;
        } else{
            PLAYER.x = 0;
        }
    }
}

//Двигаем игрока в зависимости от нажатой клавиши
function onKeyDown(event) {
    if ((event.key === "ArrowLeft") && (PLAYER.x > 0)) {
        PLAYER.x -= PLAYER.speedX;
    }
    if (event.key === "ArrowRight" && (PLAYER.x + PLAYER.width < GAME.width)) {
        PLAYER.x += PLAYER.speedX;
    }
}

//Основной цикл программы, вызываем процедуры работы с обьектами пока не проиграем
function play() {
    if (GAME.ifLost === false) {
        drawFrame();
        updateBombs();
        updatePlayer();
        requestAnimationFrame(play);
    } else {
        drawFrame();
        // alert("You lose!");
    }
}

initEventListeners();
play();