define(["fabric.min", "math"], function(fabricjs, math){ 
    function Paddle(length, width, angle) {
	this.theta = 90 - angle;
	this.pivot = {x: 0, y: 0};
	this.rightBottom = {x: 0 + length * math.cos(math.unit(this.theta, 'deg')),
			    y: 0 - length * math.sin(math.unit(this.theta, 'deg'))}
	this.line = new fabric.Line(
	    [this.pivot.x, this.pivot.y,
	     this.rightBottom.x, this.rightBottom.y],
	    {fill: 'black', stroke: 'black'});
	
	this.fabricPaddle = new fabric.Group([this.line], {transformMatrix: [1,0,  0,1,  0,0]})
    }

    Paddle.prototype = {
	
    }

    return Paddle;
});
