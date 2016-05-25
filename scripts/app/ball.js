define(["fabric.min", "math"], function(fabricjs, math){

    var Ball = function(radius, dx, dy, color) {
	this.dx = dx;
	this.dy = dy;
	this.fabricBall = new fabric.Circle({
	    radius: radius,
	    fill: color,
	    transformMatrix: [1,0,  0,1,  0,0]
	});
    }

    Ball.prototype = {
	updateVelocity : function(dx, dy) {
	    this.dx = dx;
	    this.dy = dy;
	}
    };

    return Ball;
});				  
