/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */
"use strict";

class Movable {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.rotation = 0;
		this.moveLeft = false;
	    this.moveUp = false;
	    this.moveRight = false;
	    this.moveDown = false;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
}

class Polygon {
	constructor(points, color) {
		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);

		for (var i = 0; i < points.length; i++) {
			ctx.lineTo( points[i][0] , points[i][1] )
		}

		ctx.closePath();
		ctx.fill();
	}
}

class Triangle extends Polygon {
	constructor(x, y, color) {
		super([[x, y],[x + 50, y],[x + 25, y - 50]], color);
	}
}

class Rectangle extends Movable {
	constructor(x, y, width, height, color) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.color = color;
	}

	draw() {
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.rotation * Math.PI / 180);
		
		
	    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
	    ctx.fillStyle = this.color;
	    ctx.fill();
	    ctx.closePath();
	    ctx.restore();
	}
}

class Circle extends Movable {
	constructor(x, y, r, color) {
		super(x, y);
		this.r = r;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fillStyle = this.color;
	    ctx.fill();
		ctx.stroke();
	}
}

class Platform extends Rectangle {
	constructor(x, y, width, height, color) {
		super(x, y, width, height, color);
	}
}

class Ball extends Circle {
	constructor(x, y, color) {
		super(x, y, 10, color);
	    this.xVelocity = 1;
	    this.yVelocity = 4;
	}

	intersects(b) {
	    return this.x < b.x + b.width && this.x + this.r > b.x && this.y < b.y + b.height && this.y + this.r > b.y;
  	}
}

module.exports.Polygon = Polygon;
module.exports.Triangle = Triangle;
module.exports.Rectangle = Rectangle;
module.exports.Circle = Circle;
module.exports.Ball = Ball;
module.exports.Platform = Platform;
