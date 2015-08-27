'use strict';

var Shapes = require('./Shapes');
var _C = require('./Constants').CONSTANTS;
var Controller = require('./Controller');

class PaddleFactory {
	constructor(document, window, paddleDictionary, controllerDictionary) {
		this.paddleDict = paddleDictionary;
		this.controllerDict = controllerDictionary;
		this.doc = document;
		this.win = window;
	}

	createNewPaddle(id, color) {
		this.paddleDict[id] = new Shapes.Platform(_C.PLATFORM_X, _C.PLATFORM_Y, _C.PLATFORM_WIDTH, _C.PLATFORM_HEIGHT, this.color);
		this.controllerDict[id] = new Controller(this.paddleDict[id], this.doc, this.win);
	}

}

class BallFactory {
	constructor(ballArray){
		this.ballArray = ballArray;
	}

	createNewBall(color) {
		for (var i = 0; i < 1; i++) {
		  this.ballArray.push(new Shapes.Ball(Math.random() * 500 + 50, Math.random() * 500 + 50, color));
		}
	}

}

module.exports.PaddleFactory = PaddleFactory;
module.exports.BallFactory = BallFactory;