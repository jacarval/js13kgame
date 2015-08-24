/*jshint esnext: true */
/*jshint strict: true */
/*jslint node: true */
"use strict";

class Polygon {
	constructor(poly, color) {
		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.moveTo(poly[0][0], poly[0][1]);

		for (var i = 0; i < poly.length; i++) {
			ctx.lineTo( poly[i][0] , poly[i][1] )
		}

		ctx.closePath();
		ctx.fill();
	}
}

class Triangle extends Polygon {
	constructor(x, y, color) {
		super([[x, y],[x + 50, y + 50],[x - 50, y + 50]], color);

	}
}

module.exports.Polygon = Polygon;
module.exports.Triangle = Triangle;