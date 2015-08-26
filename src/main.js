/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */

"use strict";
var raf = require('./raf');
var rng = require('./rng');
var WORLD = require('./Constants').WORLD;
var _C = require('./Constants').CONSTANTS;
var Shapes = require('./Shapes');
var Controller = require('./Controller');

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
window.onresize = setDimensions;
window.ctx = ctx;

var paddle = new Shapes.Platform(_C.PLATFORM_X, _C.PLATFORM_Y, _C.PLATFORM_WIDTH, _C.PLATFORM_HEIGHT, 'black');
var balls = [];
var controller = new Controller(paddle, document, window);

for (var i = 0; i < 250; i++) {
  balls.push(new Shapes.Ball(Math.random() * 500 + 50, Math.random() * 500 + 50));
}


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
};

setDimensions();

/*
  Draws the shapes on each frame animation
 */
function render() {
  paddle.draw();
  balls.map(function(ball){ball.draw();})
};

/*
  Updates the positions of shapes on each animation
 */
function updatePaddle(dt) {
  if (paddle.moveLeft) {
    paddle.move(-150 * dt, 0) ;
  }
  if (paddle.moveUp) {
    paddle.move(0, -150 * dt);
  }
  if (paddle.moveRight) {
    paddle.move(150 * dt, 0);
  }
  if (paddle.moveDown) {
    paddle.move(0, 150 * dt);
  }
};

/*
  Updates the positions of shapes on each animation
 */
function updateBall(ball) {

  if (ball.x > WORLD.width || ball.x < 0) {
    ball.xVelocity *= -1.01;
  }

  if (ball.y >= WORLD.height || ball.y <= 0) {
    ball.yVelocity *= -1.01;
  }

  if (ball.intersects(paddle) && ball.yVelocity > 0) {
    ball.yVelocity *= -1.01;
  }

  ball.move(ball.xVelocity, ball.yVelocity);

};

/*
  Animates the frame based on the time elapsed between animations
 */
raf.start(function(elapsed) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  // new Shapes.Polygon([ [5,5], [100,50], [50,100], [10,90] ], 'red');
  // new Shapes.Polygon([ [42,27], [66,20], [73,57], [48,62] ], 'blue');
  // new Shapes.Triangle(500, 500, 'green');
  // new Shapes.Rectangle(300, 300, 200, 100, 'black');
  // new Shapes.Circle(250, 250, 50, 'yellow');

  updatePaddle(elapsed);
  balls.map(function(ball){updateBall(ball);})
  render();
});