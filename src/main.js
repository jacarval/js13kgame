/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */

"use strict";
var raf = require('./raf');
var rng = require('./rng');
var WORLD = require('./Constants').WORLD
var Shapes = require('./Shapes');

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
window.onresize = setDimensions;
window.ctx = ctx;


/*
  This resizes the canvas and scales everything
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
  Animates the frame based on the time elapsed between animations
 */
raf.start(function(elapsed) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  new Shapes.Polygon([ [5,5], [100,50], [50,100], [10,90] ], 'red');
  new Shapes.Polygon([ [42,27], [66,20], [73,57], [48,62] ], 'blue');
  new Shapes.Triangle(500, 500, 'green');

  //update(elapsed);
  //render();
});