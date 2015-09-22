/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */

'use strict';
var raf = require('./raf');
var rng = require('./rng');
var WORLD = require('./Constants').WORLD;
var _C = require('./Constants').CONSTANTS;
var Shapes = require('./Shapes');
var socket = io();


var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
window.onresize = setDimensions;
window.ctx = ctx;

var paddles = {};
var controllers = {};
var balls = [];
var score = 10;

var paddleFactory = new (require('./AssetFactory')).PaddleFactory(document, window, paddles, controllers);
var ballFactory = new (require('./AssetFactory')).BallFactory(balls);

for (var i = 0; i < 5; i++) {
  ballFactory.createNewBall('red');
}



socket.on('create:paddle', function(id){
  paddleFactory.createNewPaddle(id);
});

socket.on('orientation-event', function(event, id) {
  if (controllers[id]) {
    controllers[id].handleOrientation(event);
  }
});

 
socket.on('touch-event', function(event, id) {
  var paddle = paddles[id];
  controllers[id].handleTouch(event);
  ballFactory.createNewBall(paddle.color);
});


/*
  Resizes the canvas and scales everything
 */
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

/*
  Draws the shapes on each frame animation
 */
function render() {

  for (var id in paddles) {
    paddles[id].draw();
  }

  balls.map(function(ball){
    ball.draw();
  });

}

/*
  Updates the positions of shapes on each animation
 */
function updateBalls(dt) {

  balls.forEach(function(ball, index){

    if (ball.x > WORLD.width || ball.x < 0) {
      ball.xVelocity *= -0.999;
    }

    if (ball.y <= 0) {
      ball.yVelocity *= -0.999;
    }

    if (ball.y >= WORLD.height) {
      balls.splice(index, 1);
      score--;
      console.log(score);
    }

    for (var id in paddles) {
      if (ball.intersects(paddles[id])) {
        ball.yVelocity *= -1.1;
      }
    }

    ball.yVelocity = ball.yVelocity - (WORLD.gravity * dt);
    ball.move(ball.xVelocity, ball.yVelocity * dt);

  });

}

/*
  Animates the frame based on the time elapsed between animations
 */
raf.start(function(elapsed) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  updateBalls(elapsed);
  render();
});



/*
  Updates the positions of shapes on each animation
 */
// function updatePaddle(dt) {
//   if (paddle.moveLeft) {
//     paddle.move(-150 * dt, 0) ;
//   }
//   if (paddle.moveUp) {
//     paddle.move(0, -150 * dt);
//   }
//   if (paddle.moveRight) {
//     paddle.move(150 * dt, 0);
//   }
//   if (paddle.moveDown) {
//     paddle.move(0, 150 * dt);
//   }
// };



