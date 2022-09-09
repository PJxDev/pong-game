import "./style.css";

const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

$("h1").innerHTML = "Hola Mundo";

const canvas = $("canvas");
const c = canvas.getContext("2d");

const cW = (canvas.width = 1024);
const cH = (canvas.height = 576);

c.fillRect(0, 0, cW, cH);

/* PLAYERS'S CLASS */
class Player {
  constructor({ position, velocity, size }) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.lastKey = "";
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
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (
      this.position.y + this.size.height + this.velocity.y >= cH ||
      this.position.y <= 0
    ) {
      this.velocity.y *= -1;
    }
    if (
      this.position.x + this.size.width + this.velocity.x >= cW ||
      this.position.x <= 0
    ) {
      this.velocity.x *= -1;
    }
  }
}

/* CREATION OF PLAYERS */
const player1 = new Player({
  position: {
    x: 50,
    y: cH / 2 - 50,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  size: {
    width: 30,
    height: 100,
  },
});

const player2 = new Player({
  position: {
    x: cW - 50,
    y: cH / 2 - 50,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  size: {
    width: 30,
    height: 100,
  },
});
const bola = new Player({
  position: {
    x: cW / 2 - 7,
    y: cH / 2 - 7,
  },
  velocity: {
    x: 3,
    y: 3,
  },
  size: {
    width: 15,
    height: 15,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  n8: {
    pressed: false,
  },
  n2: {
    pressed: false,
  },
};

/* ANIMATE FUNCTION */
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, cW, cH);
  player1.update();
  player2.update();
  bola.update();

  player1.velocity.y = 0;
  player2.velocity.y = 0;

  /* PLAYERS MOVEMENT */
  if (keys.w.pressed && player1.lastKey === "w") {
    player1.velocity.y = -2;
  } else if (keys.s.pressed && player1.lastKey === "s") {
    player1.velocity.y = 2;
  }
  if (keys.n8.pressed && player2.lastKey === "8") {
    player2.velocity.y = -2;
  } else if (keys.n2.pressed && player2.lastKey === "2") {
    player2.velocity.y = 2;
  }

  /* COLLISIONS */

  /* player 2 - frontal */
  if (
    bola.position.x + bola.size.width >= player2.position.x &&
    (bola.position.y >= player2.position.y &&
    bola.position.y <= player2.position.y + player2.size.height)
  ) {
    bola.velocity.x *= -1;
  }
  /* player 2 - trasera */
  if (
    bola.position.x >= player2.position.x + player2.size.width &&
    (bola.position.y >= player2.position.y &&
    bola.position.y <= player2.position.y + player2.size.height)
  ) {
    bola.velocity.x *= -1;
  }

  /* player 1 - frontal */
  if (
    bola.position.x <= player1.position.x + player1.size.width &&
    (bola.position.y >= player1.position.y &&
      bola.position.y <= player1.position.y + player1.size.height)
      ) {
        bola.velocity.x *= -1;
      }
  /* player 1 - trasera */
  if (
    bola.position.x >= player1.position.x &&
    (bola.position.y >= player1.position.y &&
      bola.position.y <= player1.position.y + player1.size.height)
      ) {
        bola.velocity.x *= -1;
      }
  /* player 1 - lateral inferior */
  if (
    (bola.position.x <= player1.position.x + player1.size.width && 
      bola.position.x >= player1.position.x) &&
    (bola.position.y <= player1.position.y)
  ) {
    bola.velocity.y *= -1;
    bola.velocity.x *= -1;
  }
  /* player 1 - lateral superior */
  if (
    (bola.position.x <= player1.position.x + player1.size.width && 
      bola.position.x >= player1.position.x) &&
    (bola.position.y >= player1.position.y + player1.size.height)
  ) {
    bola.velocity.y *= -1;
    bola.velocity.x *= -1;
  }
  
}

animate();

/* EVENTS */

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      player1.lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      player1.lastKey = "s";
      break;
    case "8":
      keys.n8.pressed = true;
      player2.lastKey = "8";
      break;
    case "2":
      keys.n2.pressed = true;
      player2.lastKey = "2";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "8":
      keys.n8.pressed = false;
      break;
    case "2":
      keys.n2.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
  }
});
