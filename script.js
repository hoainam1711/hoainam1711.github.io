const restartButton = document.getElementById("restartButton");
const backToSelectButton = document.getElementById("backToSelectButton");

const GRAVITY = 0.6;
const FLAP_STRENGTH = -10;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;
const HORIZONTAL_SPACING = 250;
const BASE_SPEED = 2;
const PIPE_TOP_SCALE = 1.2;
const PIPE_TOP_WIDTH = PIPE_WIDTH * PIPE_TOP_SCALE;
const PIPE_TOP_HEIGHT = 20;
const BIRD_SIZE = 20;

let bird, birdImg, birdY, birdVelocity, pipes, score, gameOver, gameSpeed, animationFrame;
let canvas = document.getElementById("gameCanvas");  
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function resetGameState() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameSpeed = BASE_SPEED;

    const savedCharacter = localStorage.getItem("selectedCharacter");
const selectedCharacter = savedCharacter ? JSON.parse(savedCharacter) : { color: "yellow", image: "assets/bird.gif" };

    bird = { x: 50, y: birdY, radius: BIRD_SIZE / 2, color: selectedCharacter.color };
    birdImg = new Image();
    birdImg.src = selectedCharacter.image;
}

const pipeImg = new Image();
pipeImg.src = "thanong.jpg"; // Ống đứng
const pipeTopImg = new Image();
pipeTopImg.src = "dauong.jpg"; // Ống ngang

function Pipe(x, height) {
    this.x = x;
    this.topHeight = height;
    this.bottomHeight = canvas.height - this.topHeight - PIPE_SPACING;
}

function drawPipe(pipe) {
    let topPipeX = pipe.x - (PIPE_TOP_WIDTH - PIPE_WIDTH) / 2;
    let bottomPipeX = pipe.x - (PIPE_TOP_WIDTH - PIPE_WIDTH) / 2;

    ctx.drawImage(pipeImg, pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.drawImage(pipeTopImg, topPipeX, pipe.topHeight - PIPE_TOP_HEIGHT, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT);
    ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + PIPE_SPACING, PIPE_WIDTH, pipe.bottomHeight);
    ctx.drawImage(pipeTopImg, bottomPipeX, pipe.topHeight + PIPE_SPACING, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT);
}

function checkCollision(bird, pipe) {
    let topPipeX = pipe.x - (PIPE_TOP_WIDTH - PIPE_WIDTH) / 2;
    let bottomPipeX = pipe.x - (PIPE_TOP_WIDTH - PIPE_WIDTH) / 2;

    return (
        circleRectCollision(bird.x, bird.y, bird.radius, pipe.x, 0, PIPE_WIDTH, pipe.topHeight) ||
        circleRectCollision(bird.x, bird.y, bird.radius, topPipeX, pipe.topHeight - PIPE_TOP_HEIGHT, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT) ||
        circleRectCollision(bird.x, bird.y, bird.radius, pipe.x, pipe.topHeight + PIPE_SPACING, PIPE_WIDTH, pipe.bottomHeight) ||
        circleRectCollision(bird.x, bird.y, bird.radius, bottomPipeX, pipe.topHeight + PIPE_SPACING, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT)
    );
}

function circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
    let nearestX = Math.max(rx, Math.min(cx, rx + rw));
    let nearestY = Math.max(ry, Math.min(cy, ry + rh));

    let dx = cx - nearestX;
    let dy = cy - nearestY;

    return (dx * dx + dy * dy) < (radius * radius);
}

function update() {
    if (gameOver) return;

    birdVelocity += GRAVITY;
    birdY += birdVelocity;
    bird.y = birdY;

    if (birdY + bird.radius * 2 > canvas.height || birdY < 0) gameOver = true;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - HORIZONTAL_SPACING) {
        let pipeHeight = Math.random() * (canvas.height - PIPE_SPACING - 100) + 50;
        pipes.push(new Pipe(canvas.width, pipeHeight));
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.splice(index, 1);
            score++;
        }
        if (checkCollision(bird, pipe)) {
            gameOver = true;
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function draw() {
    // Vẽ nền màu trắng
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Vẽ một hình chữ nhật trắng phủ toàn bộ canvas

    // Vẽ chim
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.closePath();

    // Vẽ các ống
    pipes.forEach(drawPipe);

    // Hiển thị điểm số
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Khi game over
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over! Nhấn Restart để chơi lại", canvas.width / 2 - 150, canvas.height / 2);
        restartButton.style.display = "block";
        backToSelectButton.style.display = "block";
    }
}

function flap() {
    if (!gameOver) birdVelocity = FLAP_STRENGTH;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

canvas.addEventListener("click", flap);

function gameLoop() {
    update();
    animationFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
    cancelAnimationFrame(animationFrame);
    resetGameState();
    gameLoop();
}

window.startGame = startGame;

function restartGame() {
    resetGameState();
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startGame();
    restartButton.style.display = "none";
    backToSelectButton.style.display = "none";
}

function goBackToSelectCharacter() {
    location.reload();  // Làm mới trang để quay lại màn hình chọn nhân vật
}

restartButton.addEventListener("click", restartGame);
backToSelectButton.addEventListener("click", goBackToSelectCharacter);