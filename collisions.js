import {
  ball,
  cH,
  cW,
  $,
  player1,
  player2,
  ballInit,
  endGame,
  bleep1,
  bleep2,
  point,
  soundMode,
} from "./index";

function soundPlayers(){
  
  if(!soundMode) return;

  let n = Math.floor(Math.random() * 2);
  n = n!==1 ? 2 : 1
  if (n===1){
    bleep1.currentTime = 0
    bleep1.play()
  };
  if (n===2){
    bleep2.currentTime = 0
    bleep2.play();
  } 
    
}

/* COLLISIONS */
/* Ball */
export function ballCollisions(ballOut) {
  if (
    ball.position.y + ball.size.height + ball.velocity.y >= cH ||
    ball.position.y + ball.velocity.y <= 0
  ) {
    ball.velocity.y *= -1;
  }
  if (
    ball.position.x + ball.size.width + ball.velocity.x >= cW ||
    ball.position.x + ball.velocity.x <= 0
  ) {
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    ballOut();
  }
}
/* BALL OUT */
export function ballOut(timer, setTimer) {
  if (soundMode) point.play();

  clearInterval(setTimer);
  timer = 0;
  if (ball.position.x > 50) {
    $("#score-p1").innerHTML = ++player1.score;
    setTimeout(ballInit, 2000, -1);
  }
  if (ball.position.x < 50) {
    $("#score-p2").innerHTML = ++player2.score;
    setTimeout(ballInit, 2000, 1);
  }

  if (player1.score === 3) {
    $("#subtitle").innerHTML = "PLAYER 1 WINS!!!";
    endGame();
  }
  if (player2.score === 3) {
    $("#subtitle").innerHTML = "PLAYER 2 WINS!!!";
    endGame();
  }
}
/* Players with the frame */
export function playersCollisions() {
  if (player1.position.y + player1.size.height >= cH) {
    player1.position.y = cH - player1.size.height;
  }
  if (player1.position.y <= 0) {
    player1.position.y = 0;
  }
  if (player2.position.y + player2.size.height >= cH) {
    player2.position.y = cH - player2.size.height;
  }
  if (player2.position.y <= 0) {
    player2.position.y = 0;
  }

  /* Players with the ball */
  /* Player1 */
  /* Corners */
  if (
    ball.position.x + ball.velocity.x <=
      player1.position.x + player1.size.width &&
    ball.position.x + ball.size.width + ball.velocity.x >=
      player1.position.x + player1.size.width &&
    ball.position.y + ball.velocity.y <=
      player1.position.y + player1.size.height / 4 + player1.velocity.y &&
    ball.position.y + ball.size.height + ball.velocity.y >=
      player1.position.y + player1.velocity.y
  ) {
    ball.velocity.y < 0 ? (ball.velocity.y *= 1) : (ball.velocity.y *= -1);
  }
  if (
    ball.position.x + ball.velocity.x <=
    player1.position.x + player1.size.width &&
    ball.position.x + ball.size.width + ball.velocity.x >=
    player1.position.x + player1.size.width &&
    ball.position.y + ball.velocity.y <=
    player1.position.y + player1.size.height + player1.velocity.y &&
    ball.position.y + ball.size.height + ball.velocity.y >=
    player1.position.y + (player1.size.height / 4) * 3 + player1.velocity.y
    ) {
      ball.velocity.y < 0 ? (ball.velocity.y *= -1) : (ball.velocity.y *= 1);
  }

  /* Front and Back */
  if (
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player1.position.x &&
      ball.position.x + ball.velocity.x <= player1.position.x &&
      ball.position.y + ball.velocity.y <=
        player1.position.y + player1.size.height + player1.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player1.position.y + player1.velocity.y) ||
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player1.position.x + player1.size.width &&
      ball.position.x + ball.velocity.x <=
        player1.position.x + player1.size.width &&
      ball.position.y + ball.velocity.y <=
        player1.position.y + player1.size.height + player1.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player1.position.y + player1.velocity.y)
  ) {
    soundPlayers();
    ball.velocity.x *= -1;
  }

  /* Top and Bottom */
  if (
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player1.position.x &&
      ball.position.x + ball.velocity.x <=
        player1.position.x + player1.size.width &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player1.position.y + player1.velocity.y &&
      ball.position.y + ball.velocity.y <=
        player1.position.y + player1.velocity.y) ||
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player1.position.x &&
      ball.position.x + ball.velocity.x <=
        player1.position.x + player1.size.width &&
      ball.position.y + ball.velocity.y <=
        player1.position.y + player1.size.height + player1.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player1.position.y + player1.size.height + player1.velocity.y)
  ) {
    soundPlayers();
    ball.velocity.y *= -1;
  }

  /* Player2 */
  /* Corners */
  if (
    ball.position.x + ball.size.width + ball.velocity.x >= player2.position.x &&
    ball.position.x + ball.velocity.x <= player2.position.x &&
    ball.position.y + ball.velocity.y <=
      player2.position.y + player2.size.height / 4 + player2.velocity.y &&
    ball.position.y + ball.size.height + ball.velocity.y >=
      player2.position.y + player2.velocity.y
  ) {
    ball.velocity.y < 0 ? (ball.velocity.y *= 1) : (ball.velocity.y *= -1);
  }
  if (
    ball.position.x + ball.size.width + ball.velocity.x >= player2.position.x &&
    ball.position.x + ball.velocity.x <= player2.position.x &&
    ball.position.y + ball.velocity.y <=
      player2.position.y + player2.size.height + player2.velocity.y &&
    ball.position.y + ball.size.height + ball.velocity.y >=
      player2.position.y + (player2.size.height / 4) * 3 + player2.velocity.y
  ) {
    ball.velocity.y < 0 ? (ball.velocity.y *= -1) : (ball.velocity.y *= 1);
  }

  /* Front and Back */
  if (
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player2.position.x &&
      ball.position.x + ball.velocity.x <= player2.position.x &&
      ball.position.y + ball.velocity.y <=
        player2.position.y + player2.size.height + player2.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player2.position.y + player2.velocity.y) ||
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player2.position.x + player2.size.width &&
      ball.position.x + ball.velocity.x <=
        player2.position.x + player2.size.width &&
      ball.position.y + ball.velocity.y <=
        player2.position.y + player2.size.height + player2.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player2.position.y + player2.velocity.y)
  ) {
    soundPlayers();
    ball.velocity.x *= -1;
  }

  /* Top and Bottom */
  if (
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player2.position.x &&
      ball.position.x + ball.velocity.x <=
        player2.position.x + player2.size.width &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player2.position.y + player2.velocity.y &&
      ball.position.y + ball.velocity.y <=
        player2.position.y + player2.velocity.y) ||
    (ball.position.x + ball.size.width + ball.velocity.x >=
      player2.position.x &&
      ball.position.x + ball.velocity.x <=
        player2.position.x + player2.size.width &&
      ball.position.y + ball.velocity.y <=
        player2.position.y + player2.size.height + player2.velocity.y &&
      ball.position.y + ball.size.height + ball.velocity.y >=
        player2.position.y + player2.size.height + player2.velocity.y)
  ) {
    soundPlayers();
    ball.velocity.y *= -1;
  }
}
