const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click', function () {
    window.location.reload()
})

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 4
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2
let headX = 10
let headY = 10
const snakeParts = []
let tailLength = 2

let appleX = 5
let appleY = 5

let xVelocity = 0
let yVelocity = 0

let score = 0;

const gulpSound = new Audio('gulp.mp3')
const fasterSound = new Audio('speedUp.wav')
const gameOverSound = new Audio('gameover.wav')


//game loop
function drawGame() {
    changeSnakePosition()

    let result = isGameOver();
    if (result) {
        return;
    }
    clearScreen()

    if (score > 10) {
        speed = 7
    }

    if (score > 20) {
        speed = 12
    }

    if (score > 30) {
        speed = 17
    }

    checkAppleCollision()
    drawApple()
    drawSnake()
    drawScore()
    setTimeout(drawGame, 1000 / speed)
}

function clearScreen() {
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawApple() {
    //ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
    ctx.beginPath();
    ctx.arc(appleX * tileCount + 9, appleY * tileCount + 9, tileSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'red'
    ctx.fill()
    ctx.stroke();
    ctx.fillStyle = 'black'
    ctx.fillRect(appleX * tileCount + 8, appleY * tileCount, 2, -6)
    ctx.fillStyle = 'white'
    ctx.fillRect(appleX * tileCount + 11, appleY * tileCount + 5, 3, 3)
}

function drawScore() {
    ctx.fillStyle = 'white'
    ctx.font = '15px Verdana'
    ctx.fillText("Score " + score, canvas.width - 70, 15)
}

function checkAppleCollision() {
    if (appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount)
        appleY = Math.floor(Math.random() * tileCount)
        tailLength++;
        score++;
        gulpSound.play();
        if (score == 10) {
            fasterSound.play()
        } else if (score == 20) {
            fasterSound.play()
        } else if (score == 30) {
            fasterSound.play()
        }
    }
}

function isGameOver() {
    let gameOver = false;

    if (xVelocity === 0 && yVelocity === 0) {
        return false;
    }

    //walls
    if (headX < 0 || headX == tileCount || headY < 0 || headY == tileCount) {
        gameOver = true;
    }

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.font = '50px Verdana'
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop('0', 'magenta')
        gradient.addColorStop('0.5', 'blue')
        gradient.addColorStop('1.0', 'red')
        ctx.fillStyle = gradient;
        ctx.fillText('Game Over!', canvas.width / 6.5, canvas.height / 2)
        gameOverSound.play()
    }

    return gameOver;
}

function drawSnake() {

    ctx.fillStyle = 'orange'
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY))
    while (snakeParts.length > tailLength) {
        snakeParts.shift() //remove furthest item from the snake parts if we have more than tail size
    }

    ctx.fillStyle = 'yellow'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
    ctx.fillStyle = 'black'
    ctx.fillRect(headX * tileCount + 4.5, headY * tileCount + 4.5, 3, 3)
    ctx.fillStyle = 'black'
    ctx.fillRect(headX * tileCount + 10, headY * tileCount + 4.5, 3, 3)
    ctx.fillStyle = 'black'
    ctx.fillRect(headX * tileCount + 4.5, headY * tileCount + 10, 9, 2)
}

function changeSnakePosition() {
    headX = headX + xVelocity
    headY = headY + yVelocity
}

document.body.addEventListener('keydown', keyDown)

function keyDown(event) {
    //up
    if (event.keyCode == 38 || event.keyCode == 87) {
        if (yVelocity == 1) return
        yVelocity = -1
        xVelocity = 0
    }

    //down
    if (event.keyCode == 40 || event.keyCode == 88) {
        if (yVelocity == -1) return
        yVelocity = 1
        xVelocity = 0
    }

    //left
    if (event.keyCode == 37 || event.keyCode == 65) {
        if (xVelocity == 1) return
        yVelocity = 0
        xVelocity = -1
    }

    //right
    if (event.keyCode == 39 || event.keyCode == 68) {
        if (xVelocity == -1) return
        yVelocity = 0
        xVelocity = 1
    }

}


drawGame()

