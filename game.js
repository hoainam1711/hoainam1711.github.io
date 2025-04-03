const bird = { x: 50, y: birdY, radius: BIRD_SIZE / 2, color: selectedCharacter.color }; 
const birdImg = new Image();
birdImg.src = selectedCharacter.image;

function drawBird() {
  ctx.drawImage(birdImg, bird.x, birdY, BIRD_SIZE, BIRD_SIZE);
}