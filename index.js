import { ballCollisions, ballOut, playersCollisions } from "./collisions";
import "./style.css";

/* CONFIG ENVIRONMENT */
export const $ = (el) => document.querySelector(el);
const canvas = $("canvas");
const c = canvas.getContext("2d");

export const cW = (canvas.width = 1024);
export const cH = (canvas.height = 576);

c.fillRect(0, 0, cW, cH);
$("#subtitle").innerHTML = "First getting 3 points wins!";

/* VARS AND CONSTS */
export let reset = false;
export let gameStarted = false;
export let pause = false;
export let oldVelocity = { x: 0, y: 0 };
const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

/* PLAYERS'S CLASS */
class Sprite {
  constructor({ position, velocity, size }) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.lastKey = "";
    this.direction = { x: 1, y: 1 };
    this.score = 0;
  }
  draw() {
    c.fillStyle = "white";
    c.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y * this.direction.y;
    this.position.x += this.velocity.x * this.direction.x;
  }
}

/* CREATION OF SPRITES */
export const player1 = new Sprite({
  position: {
    x: 50,
    y: cH / 2 - 50,
  },
  velocity: {
    x: 0,
    y: 3,
  },
  size: {
    width: 30,
    height: 100,
  },
});

export const player2 = new Sprite({
  position: {
    x: cW - 80,
    y: cH / 2 - 50,
  },
  velocity: {
    x: 0,
    y: 3,
  },
  size: {
    width: 30,
    height: 100,
  },
});

export const ball = new Sprite({
  position: {
    x: cW / 2 - 7,
    y: cH / 2 - 7,
  },
  velocity: {
    x: 5,
    y: 5,
  },
  size: {
    width: 15,
    height: 15,
  },
});

$("#score-p1").innerHTML = player1.score;
$("#score-p2").innerHTML = player2.score;

/* EVENTS */

/* Start Button */
$(".start-button").addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    let rx = Math.floor(Math.random() * 2);
    rx = rx != 1 ? -1 : 1;
    let ry = Math.floor(Math.random() * 2);
    ry = ry != 1 ? -1 : 1;

    ball.velocity.x = 4 * rx;
    ball.velocity.y = 4 * ry;

    pause = false;
  }

  if (reset) {
    player1.score = 0;
    player2.score = 0;
    $("#score-p1").innerHTML = player1.score;
    $("#score-p2").innerHTML = player2.score;
    $("#subtitle").innerHTML = "First getting 3 points wins!";
  }
});

/* Keys */
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    pauseGame();
  }
  if (!pause) {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        player1.lastKey = "w";
        break;
      case "s":
        keys.s.pressed = true;
        player1.lastKey = "s";
        break;
      case "ArrowUp":
        e.preventDefault();
        keys.up.pressed = true;
        player2.lastKey = "ArrowUp";
        break;
      case "ArrowDown":
        e.preventDefault();
        keys.down.pressed = true;
        player2.lastKey = "ArrowDown";
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "ArrowUp":
      keys.up.pressed = false;
      break;
    case "ArrowDown":
      keys.down.pressed = false;
      break;
  }
});

/* FUNCTIONS */
function pauseGame() {
  pause = pause ? false : true;

  if (pause) {
    $(".start-button").innerHTML =
      "<h2>Paused <br/><br/>Press Space to resume</h2>";
    oldVelocity.x = ball.velocity.x;
    oldVelocity.y = ball.velocity.y;
    ball.velocity.x = 0;
    ball.velocity.y = 0;
  } else {
    ball.velocity.x = oldVelocity.x;
    ball.velocity.y = oldVelocity.y;
  }
}

export function ballInit(n) {
  let random = Math.floor(Math.random() * 2);
  if (random != 1) random = -1;

  ball.position.x = cW / 2 - 7;
  ball.position.y = cH / 2 - 7;
  ball.velocity.x = 4 * n;
  ball.velocity.y = 4 * random;
  player1.position.x = 50;
  player1.position.y = cH / 2 - 50;
  player2.position.x = cW - 80;
  player2.position.y = cH / 2 - 50;
}

export function endGame() {
  gameStarted = false;
  reset = true;
}

/* ANIMATE FUNCTION */
function animate() {
  window.requestAnimationFrame(animate);

  /* Frame */
  c.fillStyle = "black";
  c.fillRect(0, 0, cW, cH);

  c.beginPath();
  c.strokeStyle = "white";
  c.moveTo(0, 0);
  c.lineWidth = 15;
  c.lineCap = "round";
  c.lineTo(1024, 0);
  c.lineTo(1024, 576);
  c.lineTo(0, 576);
  c.lineTo(0, 0);
  c.stroke();

  player1.draw();
  player2.draw();

  /* Game */
  if (gameStarted) {
    $(".start-button").style.opacity = pause ? 1 : 0;
    $(".start-button").style.cursor = "default";
    $(".start-button").classList.remove("start");
    $(".start-button").classList.add("pause");

    gameOn();
  } else {
    $(".start-button").style.opacity = 1;
    $(".start-button").classList.add("start");
    $(".start-button").style.cursor = "pointer";
    $(".start-button").innerHTML = "<h2>Start Game</h2>";
  }

  player1.direction.y = 0;
  player2.direction.y = 0;

  /* PLAYERS MOVEMENT */
  if (keys.w.pressed && player1.lastKey === "w") {
    player1.direction.y = -1;
  } else if (keys.s.pressed && player1.lastKey === "s") {
    player1.direction.y = 1;
  }
  if (keys.up.pressed && player2.lastKey === "ArrowUp") {
    player2.direction.y = -1;
  } else if (keys.down.pressed && player2.lastKey === "ArrowDown") {
    player2.direction.y = 1;
  }

  /* COLLISIONS */

  /* Ball */
  ballCollisions(ballOut);

  /* Players */
  playersCollisions();

  function gameOn() {
    player1.update();
    player2.update();
    ball.update();
  }
}

animate();
