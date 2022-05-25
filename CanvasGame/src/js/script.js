//Создаем экран, задаем размеры окна с игрой, добавляем переменную для проверки поражения, задаем цвет фона
var GAME = {
    width: 600,
    height: 870,
    ifLost: false,
    backgroundColor: "red"
}

//Добавляем окно с доп. информацией(жизни и очки), задаем ширину, длинну, положение на экране, задаем цвет фона и текста
var InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width,
    backgroundColor: "black",
    textColor: "white"
}

//Создаем игрока, адаптируем размеры и положение под экран, добавляем переменные счетчика очков, жизней, также даем игроку скорость, цвет
var PLAYER = {
    x: GAME.width * 0.45,
    y: GAME.height * 0.9,
    height: GAME.height * 0.03,
    width: GAME.width * 0.07,
    score: 0,
    lives: 3,
    speedX: 20,
    color: "white"
}

//Добавляем константы для случайно генерации бомд
var maxSize = 50;
var maxSpeed = 20;

//Создаем бомбу, случайное расположение по экрану, случайный размер, положение за экраном, случайная скорость и указываем цвет
var BOMB = {
    x: Math.floor(Math.random() * (GAME.width - maxSize * 2) + maxSize),
    size: Math.floor(Math.random() * maxSize + 5),
    y: -maxSize,
    speedy: Math.floor(Math.random() * maxSpeed + 5),
    color: "black"
}

//Создание инструментов рисования и разметки границ холста
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

//Отрисовка фона
function drawBackground() {
    canvasContext.fillStyle = GAME.backgroundColor;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

//Отрисовываем игрока
function drawPlayer() {
    canvasContext.fillStyle = PLAYER.color;
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

//Отрисовываем бомбу
function drawBomb() {
    canvasContext.fillStyle = BOMB.color;
    canvasContext.beginPath();
    canvasContext.arc(BOMB.x, BOMB.y, BOMB.size, 0, Math.PI * 2);
    canvasContext.fill();
}

//Отрисовываем окно для вывода доп. данных и выводим там сами данные
function drawInfoWindow() {
    canvasContext.fillStyle = InfoWindow.backgroundColor;
    canvasContext.beginPath();
    canvasContext.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.fill();
    canvasContext.fillStyle = InfoWindow.textColor;
    canvasContext.font = "30px serif";
    canvasContext.fillText("Your score:", InfoWindow.x + 10, 50);
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    canvasContext.fillText("Your lives:", InfoWindow.x + 10, 120);
    canvasContext.fillText(PLAYER.lives, InfoWindow.x + 10, 155);
}

//Создаем процедуру случайной генерации бомбы после ее падения или столкновения
function respawnBomb(){
    BOMB.size = Math.floor(Math.random() * maxSize + 15);
    BOMB.y = -BOMB.size;
    BOMB.x = Math.floor(Math.random() * (GAME.width - BOMB.size * 2) + BOMB.size);
    BOMB.speedy = Math.floor(Math.random() * maxSpeed + 10);
}

//Процедура движения бомбы по экрану и проверки на столкновения
function updateBombs() {
    BOMB.y += BOMB.speedy;
    var losePositionY = BOMB.y + BOMB.size >= PLAYER.y;
    var losePositionX = (BOMB.x - BOMB.size <= PLAYER.x + PLAYER.width) && (BOMB.x + BOMB.size >= PLAYER.x);
    var scoreUpdate = (BOMB.y >= GAME.height + BOMB.size) && !GAME.ifLost;
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
    drawBomb();
    drawInfoWindow();
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
        alert("You lose!");
    }
}

initEventListeners();
play();
