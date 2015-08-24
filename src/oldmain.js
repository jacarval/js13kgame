/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */

"use strict";
var raf = require('./raf');
var rng = require('./rng');

/*

  Canvas

 */

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');

var WORLD = {
  gravity: -1000,
  width: 1280.0,
  height: 600.0,
  phase: 1,
  base: 600.0,
};

var CONSTANTS = {
  PLATFORM_WIDTH: 100,
  PLATFORM_HEIGHT: 20,
  PLATFORM_COLOR: '#0095DD',
  PLAYER_JUMPSPEED: -600,
  STOMPER_WIDTH: 100,
  STOMPER_HEIGHT: 100,
  STOMPER_COLOR: 'red'
};

/*

  Classes

 */

class GameObject {
  constructor(xPosition, yPosition, width, height, color) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  move(deltaX, deltaY) {
    this.xPosition = this.xPosition + deltaX;
    this.yPosition = this.yPosition + deltaY;
  }

  intersects(b) {
    return  this.xPosition < b.xPosition + b.width && 
            this.xPosition + this.width > b.xPosition &&
            this.yPosition < b.yPosition + b.height &&
            this.yPosition + this.height > b.yPosition;
  }

  draw() {
    // ctx.save();
    // ctx.translate(-this.width/2, -this.height/2);
    ctx.beginPath();
    ctx.rect(this.xPosition, this.yPosition, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    // ctx.restore();
  }
}

class Character extends GameObject {
  constructor(xPosition, yPosition, width, height, color) {
    super(xPosition, yPosition, width, height, color);
    this.moveLeft = false;
    this.moveUp = false;
    this.moveRight = false;
    this.moveDown = false;
    this.jump = false;
    this.jumpSpeed = CONSTANTS.PLAYER_JUMPSPEED;
    this.velocity = 0;
    this.gravity = WORLD.gravity;
  }
}

class Platform extends GameObject {
  constructor(xPosition, yPosition) {
    super(xPosition, yPosition, CONSTANTS.PLATFORM_WIDTH, CONSTANTS.PLATFORM_HEIGHT, CONSTANTS.PLATFORM_COLOR);
  }
}

class Stomper extends GameObject {
  constructor(xPosition, yPosition) {
    super(xPosition, yPosition, CONSTANTS.STOMPER_WIDTH, CONSTANTS.STOMPER_HEIGHT, CONSTANTS.STOMPER_COLOR);
    this.velocity = 0;
  }
}

function setDimensions() {
  var rw, rh, r;
  rw = window.innerWidth / WORLD.width;
  rh = window.innerHeight / WORLD.height;
  r = Math.min(rw, rh);

  canvas.height = WORLD.height * r;
  canvas.width = WORLD.width * r;

  canvas.style.marginTop = rw <= rh ? String((window.innerHeight - canvas.height) / 2) + 'px' : 0;

  ctx.scale(r, r);
}

setDimensions();

window.onresize = setDimensions;

var player = new Character(100, WORLD.height / 2, 20, 40,'#0095DD', ctx);
var player2 = new Character(WORLD.width/ 2, WORLD.height / 2, 20, 40,'#000000', ctx);
var platforms = [new Platform(50, WORLD.height - 100)];
var stomper = new Stomper(WORLD.width / 2, 0)
var stompers = [stomper];

function generatePlatforms() {
  var xPos = 0;
  while (xPos < WORLD.width) {
    var newPlatform = new Platform(platforms[platforms.length -1].xPosition + 150, WORLD.height - 100);
    platforms.push(newPlatform);
    xPos = newPlatform.xPosition;
  }
}

generatePlatforms();

function generateStomper() {

}

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
    if (player.velocity === 0) {
      player.velocity = player.jumpSpeed;
    }
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

function reverse() {
  WORLD.phase = -WORLD.phase;
  // WORLD.base = WORLD.phase === -1 ? 0 : WORLD.height;
  WORLD.gravity = -WORLD.gravity;
}

function update(dt) {

  if (player.xPosition >= WORLD.width * 2 / 3 && player.moveRight){
    player.xPosition = (WORLD.width * 2 / 3);
    platforms.map(function(platform) {
      platform.xPosition -= (150 * dt);
    });
  }
  else {
    if (player.moveLeft) {
    player.move(-150 * dt, 0) ;
    }
    if (player.moveUp) {
      player.move(0, -150 * dt);
    }
    if (player.moveRight) {
      player.move(150 * dt, 0);
    }
    if (player.moveDown) {
      player.move(0, 150 * dt);
    }
  }





  player.yPosition += Math.min((player.velocity * dt), WORLD.base - player.yPosition - player.height);
  player.velocity = !(WORLD.base - player.yPosition - player.height) ? 0 : player.velocity - (WORLD.gravity * dt);

  player2.yPosition = player.yPosition * -1 + WORLD.height - player.height;
  player2.xPosition = player.xPosition * -1 + WORLD.width;

  stomper.yPosition += Math.min((stomper.velocity * dt), WORLD.base - stomper.yPosition - stomper.height);
  stomper.velocity = !(WORLD.base - stomper.yPosition - stomper.height) ? 0 : stomper.velocity - (WORLD.gravity * dt);

  // console.log('velocity: ', player.velocity);
  
  // Collision detection for platforms
  platforms.map(function(platform){
    if (player.intersects(platform) && player.velocity > 0) {
      player.velocity = 0;
    }
  });
  // Make platforms go away
  if (platforms[0].xPosition < 0) {
    platforms.splice(0, 1);
    platforms.push(new Platform(platforms[platforms.length - 1].xPosition + 150, WORLD.height - 100));
  }
}

function render() {
  player.draw();
  player2.draw();
  platforms.map(function(platform){platform.draw();});
  stompers.map(function(stomper){stomper.draw();});
}


raf.start(function(elapsed) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  update(elapsed);
  render();
});
