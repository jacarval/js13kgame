'use strict';

class Controller {
  constructor(obj, document, window){
    this.obj = obj;
    this.counter = 0;
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    // window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
  }

  scaleValue(value, sMin, sMax, min, max) {
    return (sMax - sMin) * (value - min) / (max - min) + sMin;
  }

  handleOrientation(event) {
    var alpha = -(event.alpha + 30) % 60  // twist/compass
    var beta = -event.beta;    // tilt
    var gamma = event.gamma; // rotation

    var x = this.scaleValue(alpha, 0, 800, -60, 0);
    var y = this.scaleValue(beta, 0, 600, -45, 15);

    // console.log(alpha, beta, gamma);

    this.obj.x = x;
    this.obj.y = y;
    this.obj.rotation = gamma;
  }

  handleTouch(event) {
    var colors = ['red', 'blue', 'green', 'yellow'];
    this.obj.color = colors[this.counter];
    this.counter = (this.counter + 1) % 4;
  }

  keyDownHandler(e) {
    if(e.keyCode == 37) {
      this.obj.moveLeft = true;
    }
    else if(e.keyCode == 38) {
      this.obj.moveUp = true;
    }
    else if(e.keyCode == 39) {
      this.obj.moveRight = true;
    }
    else if(e.keyCode == 40) {
      this.obj.moveDown = true;
    }
  }

  keyUpHandler(e) {
    if(e.keyCode == 37) {
      this.obj.moveLeft = false;
    }
    if(e.keyCode == 38) {
      this.obj.moveUp = false;
    }
    if(e.keyCode == 39) {
      this.obj.moveRight = false;
    }
    if(e.keyCode == 40) {
      this.obj.moveDown = false;
    }
  }
}

module.exports = Controller;