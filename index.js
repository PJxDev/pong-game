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

export const bleep1 = new Audio("./assets/sfx/bleep1.mp3");
export const bleep2 = new Audio("./assets/sfx/bleep2.mp3");
export const point = new Audio("./assets/sfx/point.mp3");

/* VARS AND CONSTS */
export let reset = false;
export let gameStarted = false;
export let pause = false;
export let oldVelocity = { x: 0, y: 0 };
let currentSpeed = 3;
let timer = 0;
let setTimer;
const asteroid = [];
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

export let soundMode = true;
$("#turnSound").innerHTML = `Sound: ${soundMode ? "On" : "Off"}`;

let turnGameEvents;
$("#turn-game-events").innerHTML = `Game Events: ${
  turnGameEvents ? "On" : "Off"
}`;

/* PLAYERS'S CLASS */
class Sprite {
  constructor({ position, velocity, speed, size, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.speed = speed;
    this.size = size;
    this.lastKey = "";
    this.direction = { x: 1, y: 1 };
    this.score = 0;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
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
  imageSrc: "./assets/img/ship2.gif",
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
  imageSrc: "./assets/img/ship1.gif",
});

export const ball = new Sprite({
  position: {
    x: cW / 2 - 7,
    y: cH / 2 - 7,
  },
  velocity: {
    x: 1,
    y: 1,
  },
  size: {
    width: 16,
    height: 16,
  },
  imageSrc: "./assets/img/ball.gif",
});

$("#score-p1").innerHTML = player1.score;
$("#score-p2").innerHTML = player2.score;

/* EVENTS */

/* Change difficult */
$("#minus-speed").addEventListener("click", function () {
  currentSpeed -= 1;
  if (currentSpeed < 1) currentSpeed = 1;
  changeSpeedBall(currentSpeed, ball);
});
$("#plus-speed").addEventListener("click", function () {
  currentSpeed += 1;
  if (currentSpeed > 5) currentSpeed = 5;
  changeSpeedBall(currentSpeed, ball);
});

/* Sound on/off */
$("#turnSound").addEventListener("click", function () {
  soundMode = soundMode ? false : true;
  $("#turnSound").innerHTML = `Sound: ${soundMode ? "On" : "Off"}`;
});

/* Game Events on/off */
$("#turn-game-events").addEventListener("click", function () {
  turnGameEvents = turnGameEvents ? false : true;

  if (!turnGameEvents) {
    timer = 0;
    clearInterval(setTimer);
  }

  $("#turn-game-events").innerHTML = `Game Events: ${
    turnGameEvents ? "On" : "Off"
  }`;
});

/* Start Button */
$(".start-button").addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    let rx = Math.floor(Math.random() * 2);
    rx = rx != 1 ? -1 : 1;
    let ry = Math.floor(Math.random() * 2);
    ry = ry != 1 ? -1 : 1;

    ball.velocity.x = ball.speed * rx;
    ball.velocity.y = ball.speed * ry;

    pause = false;
    timer = 0;
    if (!turnGameEvents) return;
    setTimer = setInterval(() => timer++, 1000);
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

let once = false;

function gameEvents() {
  if (!turnGameEvents) return;
  if (timer % 10 === 0 && timer != 0) {
    asteroidsRain();
  } else once = false;
}

function asteroidsRain() {
  if (once) return;
  once = true;
  let random = (n) => {
    let numberRandom = Math.floor(Math.random() * n);
    if (numberRandom === 0) return 1;
    return numberRandom;
  };
  let asteroidArrayLength = asteroid.length - 1;
  for (let i = 0; i < 7; i++) {
    asteroid[asteroidArrayLength + i] = new Sprite({
      position: {
        x: random(400),
        y: random(100) * i * -1,
      },
      velocity: {
        x: 0.5,
        y: random(3),
      },
      size: {
        width: 30,
        height: 30,
      },
      imageSrc: "./assets/img/asteroid.gif",
    });
  }
}

function changeSpeedBall(newSpeed, ball) {
  ball.speed = newSpeed;
  let dificulty = "";
  switch (ball.speed) {
    case 1: {
      dificulty = "Very easy";
      break;
    }
    case 2: {
      dificulty = "Easy";
      break;
    }
    case 3: {
      dificulty = "Normal";
      break;
    }
    case 4: {
      dificulty = "Hard";
      break;
    }
    case 5: {
      dificulty = "Very hard";
      break;
    }
  }
  $("#ball-speed").innerHTML = `Ball Speed: ${dificulty}`;
}

function pauseGame() {
  pause = pause ? false : true;

  if (pause) {
    $(".start-button").innerHTML =
      "<h2>Paused <br/><br/>Press Space to resume</h2>";
    oldVelocity.x = ball.velocity.x;
    oldVelocity.y = ball.velocity.y;
    ball.velocity.x = 0;
    ball.velocity.y = 0;

    asteroid.forEach((el) => {
      el.speed = el.velocity.y;
      el.velocity.y = 0;
      el.velocity.x = 0;
    });

    clearInterval(setTimer);
  } else {
    ball.velocity.x = oldVelocity.x;
    ball.velocity.y = oldVelocity.y;

    asteroid.forEach((el) => {
      el.velocity.y = el.speed;
      el.velocity.x = 0.5;
    });
    if (!turnGameEvents) return;
    setTimer = setInterval(() => timer++, 1000);
  }
}

export function ballInit(n) {
  let random = Math.floor(Math.random() * 2);
  if (random != 1) random = -1;

  ball.position.x = cW / 2 - 7;
  ball.position.y = cH / 2 - 7;
  ball.velocity.x = ball.speed * n;
  ball.velocity.y = ball.speed * random;
  player1.position.x = 50;
  player1.position.y = cH / 2 - 50;
  player2.position.x = cW - 80;
  player2.position.y = cH / 2 - 50;

  clearInterval(setTimer);
  timer = 0;
  if (!turnGameEvents) return;
  setTimer = setInterval(() => timer++, 1000);
}

export function endGame() {
  gameStarted = false;
  reset = true;
  clearInterval(setTimer);
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

  changeSpeedBall(currentSpeed, ball);
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
    gameEvents();
    asteroid.forEach((element) => {
      element.update();
    });
  }
}
animate();
