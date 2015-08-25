'use strict';

class Controller {
  constructor(obj, document, window){
    this.obj = obj;
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
  }

  handleOrientation(event) {
    var gamma = event.gamma + 90;

    var x = gamma;

    var r = 800 / 180;

    // console.log(gamma);
    // console.log(gamma);

    this.obj.x = (x * r - 50);
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