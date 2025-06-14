
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let gameOver = false;
let dragonY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const lift = -10;
let isFlying = false;

const splashImage = new Image();
splashImage.src = "dragon.png";

const dragon = new Image();
dragon.src = "dragon_only.png";

let obstacles = [];
const obstacleWidth = 100;
const gapHeight = 200;
const obstacleSpeed = 4;
let frame = 0;

let gems = [];
const gemSize = 30;
let score = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) gameStarted = true;
        if (!gameOver) isFlying = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') isFlying = false;
});

canvas.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
    } else if (gameOver) {
        location.reload();
    }
});

function generateObstacle() {
    const topHeight = Math.random() * (canvas.height - gapHeight - 200) + 50;
    obstacles.push({ x: canvas.width, top: topHeight });
}

function generateGem() {
    gems.push({ x: canvas.width, y: Math.random() * (canvas.height - gemSize) });
}

function drawSplash() {
    ctx.drawImage(splashImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tap to Play", canvas.width / 2, canvas.height - 100);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    velocity += gravity;
    if (isFlying) velocity = lift;
    dragonY += velocity;

    ctx.drawImage(dragon, 100, dragonY, 100, 100);

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        ctx.fillStyle = "#228B22";
        ctx.fillRect(obs.x, 0, obstacleWidth, obs.top);
        ctx.fillRect(obs.x, obs.top + gapHeight, obstacleWidth, canvas.height);
        obs.x -= obstacleSpeed;

        if (
            100 + 100 > obs.x && 100 < obs.x + obstacleWidth &&
            (dragonY < obs.top || dragonY + 100 > obs.top + gapHeight)
        ) {
            gameOver = true;
        }

        if (obs.x + obstacleWidth === 100) score++;
    }

    ctx.fillStyle = "deepskyblue";
    for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        ctx.beginPath();
        ctx.arc(gem.x, gem.y, gemSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        gem.x -= obstacleSpeed;

        if (
            gem.x < 200 && gem.x + gemSize > 100 &&
            gem.y < dragonY + 100 && gem.y + gemSize > dragonY
        ) {
            gems.splice(i, 1);
            score += 5;
        }
    }

    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 50);

    if (gameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.font = "30px Arial";
        ctx.fillText("Click or Press Space to Restart", canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    frame++;
    if (frame % 100 === 0) generateObstacle();
    if (frame % 150 === 0) generateGem();

    requestAnimationFrame(drawGame);
}

function gameLoop() {
    if (!gameStarted) {
        drawSplash();
    } else {
        drawGame();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
