<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url('anh5.jpg') no-repeat center center;
            background-size: cover;
        }
        #gameCanvas {
            border: 2px solid black;
            display: block;
        }
        #gameOverMessage {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 30px;
            color: black;
            text-align: center;
        }
        .character-select {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
        .character {
            width: 80px;
            height: 80px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="characterSelect">
        <div class="character-select">
            <img src="anh1.png" class="character" id="character1" alt="Character 1">
            <img src="anh4.png" class="character" id="character2" alt="Character 2">
        </div>
    </div>
    <canvas id="gameCanvas"></canvas>
    <div id="gameOverMessage">
        <p>Game Over!</p>
        <p>Score: <span id="finalScore"></span></p>
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gameOverMessage = document.getElementById('gameOverMessage');
        const finalScore = document.getElementById('finalScore');
        const characterSelect = document.getElementById('characterSelect');
        const character1Img = document.getElementById('character1');
        const character2Img = document.getElementById('character2');

        function setCanvasSize() {
            const aspectRatio = 320 / 480;
            const width = window.innerWidth > 320 ? 320 : window.innerWidth;
            const height = width / aspectRatio;
            canvas.width = width;
            canvas.height = height;
        }

        let birdY, birdVelocity, birdImg, birdWidth, birdHeight;
        let selectedBird = 'anh1.png';

        function chooseCharacter(characterImage) {
            selectedBird = characterImage.src;
            birdImg.src = selectedBird;
            characterSelect.style.display = 'none';
            startGame();
        }

        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();

        let gravity = 0.25;
        let jumpStrength = -5;
        let pipeWidth = 50;
        let pipeGap = 200;
        let pipeSpeed = 1.5;
        let pipes = [];
        let score = 0;
        let gameStarted = false;
        let gameTime = 0;
        let isJumping = false;

        const topPipeImg = new Image();
        const bottomPipeImg = new Image();
        topPipeImg.src = 'anh3.png'; 
        bottomPipeImg.src = 'anh2.png';

        birdImg = new Image();
        birdImg.src = selectedBird; 

        birdWidth = 60;
        birdHeight = 50;

        function drawBird() {
            ctx.drawImage(birdImg, 50, birdY, birdWidth, birdHeight);
        }

        function drawPipes() {
            for (let i = 0; i < pipes.length; i++) {
                let pipeX = pipes[i].x;
                let pipeHeightTop = pipes[i].top;
                let pipeHeightBottom = pipes[i].bottom;
                ctx.drawImage(topPipeImg, pipeX, 0, pipeWidth, pipeHeightTop);
                ctx.drawImage(bottomPipeImg, pipeX, canvas.height - pipeHeightBottom, pipeWidth, pipeHeightBottom);
            }
        }

        function updatePipes() {
            if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
                let pipeHeightTop = Math.floor(Math.random() * (canvas.height - pipeGap));
                let pipeHeightBottom = canvas.height - pipeHeightTop - pipeGap;
                pipes.push({x: canvas.width, top: pipeHeightTop, bottom: pipeHeightBottom});
            }
            pipes.forEach((pipe, index) => {
                pipe.x -= pipeSpeed;
                if (pipe.x + pipeWidth < 0) {
                    pipes.splice(index, 1);
                    score++;
                }
            });
        }

        function updateBird() {
            birdVelocity += gravity;
            birdY += birdVelocity;
            if (birdY + birdHeight > canvas.height || birdY < 0) {
                gameOver();
            }
        }

        function checkCollisions() {
            pipes.forEach(pipe => {
                if (50 + birdWidth > pipe.x && 50 < pipe.x + pipeWidth) {
                    if (birdY < pipe.top || birdY + birdHeight > canvas.height - pipe.bottom) {
                        gameOver();
                    }
                }
            });
        }

        function jump() {
            birdVelocity = jumpStrength;
        }

        function gameOver() {
            gameStarted = false;
            finalScore.innerText = score;
            gameOverMessage.style.display = 'block';
            canvas.style.display = 'none';
        }

        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 10, 30);
        }

        function update() {
            if (!gameStarted) return;
            gameTime++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBird();
            drawPipes();
            drawScore();
            updateBird();
            updatePipes();
            checkCollisions();
            requestAnimationFrame(update);
        }

        character1Img.addEventListener('click', () => chooseCharacter(character1Img));
        character2Img.addEventListener('click', () => chooseCharacter(character2Img));
    </script>
</body>
</html>




