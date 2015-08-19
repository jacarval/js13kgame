var raf = require('./raf');
var rng = require('./rng');

/*

  Classes or entities?

 */
var WORLD = {
  gravity: -1000,
  width: 1280.0,
  height: 800.0,
  phase: 1,
  base: 800.0
};

var GameObject = function(xPosition, yPosition, width, height, color, context) {
  this.xPosition = xPosition;
  this.yPosition = yPosition;
  this.width = width;
  this.height = height;
  this.color = color;
  this.ctx = context;
  this.moveLeft = false;
  this.moveUp = false;
  this.moveRight = false;
  this.moveDown = false;

  this.draw = function() {
    ctx.save();
    ctx.translate(-this.width/2, -this.height/2);
    ctx.beginPath();
    ctx.rect(this.xPosition, this.yPosition, this.width, this.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };
};

var Character = function(xPosition, yPosition, width, height, color, context) {
  GameObject.call(this, xPosition, yPosition, width, height, color, context);
  this.jump = false;
  this.jumpSpeed = -WORLD.height;
  this.jumpMomentum = 0;
  this.gravity = WORLD.gravity;
};

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

var Platform = function(xPosition, yPosition, width, height, color, context) {
  GameObject.call(this, xPosition, yPosition, width, height, color, context);
};

Platform.prototype = Object.create(GameObject.prototype);
Platform.prototype.constructor = Platform;

/*

  Canvas

 */

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');


function setDimensions() {
  var rw, rh, r;
  rw = window.innerWidth / WORLD.width;
  rh = window.innerHeight / WORLD.height;
  r = Math.min(rw, rh);

  canvas.height = WORLD.height * r;
  canvas.width = WORLD.width * r;

  canvas.style.marginTop = rw <= rh ? String((window.innerHeight - canvas.height) / 2) + 'px' : 0;

  ctx.scale(canvas.width / WORLD.width, canvas.height / WORLD.height);

}

setDimensions();

window.onresize = setDimensions;

var player = new Character(WORLD.width/ 2, WORLD.height - 50, 10, 20,'#0095DD', ctx);
var player2 = new Character(WORLD.width/ 2, WORLD.height / 2, 10, 20,'#000000', ctx);
var platform = new Platform(50, 50, 50, 10,'#0095DD', ctx);

/*
  
  Controller

 */

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 37) {
    player.moveLeft = true;
  }
  else if(e.keyCode == 38) {
    player.moveUp = true;
  }
  else if(e.keyCode == 39) {
    player.moveRight = true;
  }
  else if(e.keyCode == 40) {
    player.moveDown = true;
  }
  // hitting space 
  else if(e.keyCode == 32) {
    console.log("jump");
    player.jumpMomentum = player.jumpSpeed;
  }
  // hit R for reverse
  else if(e.keyCode == 82) {
    reverse();
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 37) {
    player.moveLeft = false;
  }
  if(e.keyCode == 38) {
    player.moveUp = false;
  }
  if(e.keyCode == 39) {
    player.moveRight = false;
  }
  if(e.keyCode == 40) {
    player.moveDown = false;
  }
}

/*

  Render/update/draw

 */

function reverse() {
  WORLD.phase = -WORLD.phase;
  // WORLD.base = WORLD.phase === -1 ? 0 : WORLD.height;
  WORLD.gravity = -WORLD.gravity;
}

function update(dt) {
  updatePlayer(dt);
}

function updatePlayer(dt) {

  if (player.moveLeft) {
    player.xPosition -= (150 * dt);
  }
  if (player.moveUp) {
    player.yPosition -= (150 * dt);
  }
  if (player.moveRight) {
    player.xPosition += (150 * dt);
  }
  if (player.moveDown) {
    player.yPosition += (150 * dt);
  }

  player.yPosition += Math.min((player.jumpMomentum * dt), WORLD.base - player.yPosition - player.height / 2);
  player.jumpMomentum = !(WORLD.base - player.yPosition - player.height / 2) ? 0 : player.jumpMomentum - (WORLD.gravity * dt);

  player2.yPosition = player.yPosition * -1 + WORLD.height;
  player2.xPosition = player.xPosition * -1 + WORLD.width;

  console.log('jumpMomentum: ', player.jumpMomentum);

}

function render() {
  player.draw();
  player2.draw();
  platform.draw();
}


raf.start(function(elapsed) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  update(elapsed);
  render();
});
