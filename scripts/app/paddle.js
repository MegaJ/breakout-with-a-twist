define(["fabric.min", "math"], function(fabricjs, math){

    var calculateLeftSideTopPoint = function(vector_v, paddleWidth){
	var v_x = vector_v.x;
	var v_y = vector_v.y;
	
	var w_y = math.chain(v_x*v_x)
	    .divide(v_x*v_x + v_y*v_y)
	    .sqrt()
	    .done();
	console.log('w_y: ' + w_y);
	var w_x = math.sqrt(1 - math.multiply(w_y, w_y));

	// vector pointing down, flip sign
	if (v_y < 0) {w_x *= -1}
	
	console.log('w_x: ' + w_x);
	// multiply by the scalar paddleWidth
	// flip w_x, w_y to negative because of screen coordinate system
	var vector_w = {x: w_x*paddleWidth,
			y: w_y*paddleWidth};
	return vector_w;
    }

    var Paddle = function(length, width, angle) {
	this.theta = theta = 90 - angle;
	this.pivot = pivot = {x: 0, y: 0};
	this.rightBottom = rightBottom = {x: 0 + length * math.cos(math.unit(theta, 'deg')),
			    y: 0 - length * math.sin(math.unit(theta, 'deg'))}
	this.line = line = new fabric.Line(
	    [pivot.x, pivot.y,
	     rightBottom.x, rightBottom.y],
	    {fill: 'black', stroke: 'black'});
	
	//this.fabricPaddle = new fabric.Group([line], {transformMatrix: [1,0,  0,1,  0,0]})
	
	var sideA = width;
	var sideC = sideA / math.sin(math.unit(90 - theta, 'deg'));
	console.log("This is c: " + sideC);
	this.offsetPivot = offsetPivot = {x: 0, y: 0 - sideC};

	var vector_v = {x : rightBottom.x - 0,
			y: -1*(rightBottom.y - 0)};
	var vector_w = calculateLeftSideTopPoint(vector_v, width);
	this.rightTop = rightTop = {x: rightBottom.x - vector_w.x,
			y: rightBottom.y - vector_w.y};

	
	console.log(rightTop);
	this.line2 = line2 =  new fabric.Line([offsetPivot.x, offsetPivot.y,
				  rightTop.x, rightTop.y], {
				      fill: 'red',
				      stroke: 'red'
				  });
	//canvas.add(line2);
	Window.line2 = line2;

	// vector_s is a reflection of vector_v
	var vector_s = {x: -1*(rightTop.x - offsetPivot.x),
			y: rightTop.y - offsetPivot.y}
	this.leftTop = leftTop = {x: offsetPivot.x + vector_s.x,
		       y: offsetPivot.y + vector_s.y}
	
	this.line3 = line3 = new fabric.Line([offsetPivot.x, offsetPivot.y,
				  leftTop.x, leftTop.y], {
				      fill: 'orange',
				      stroke: 'orange'
				  });
	
	Window.line2 = line3;

	var vector_t = {x: -1*(rightBottom.x - 0),
			y: rightBottom.y - 0}
	this.leftBottom = leftBottom = {x: 0 + vector_t.x,
			  y: 0 + vector_t.y};

	this.line4 = line4 =  new fabric.Line([0, 0,
				  leftBottom.x, leftBottom.y], {
				      fill: 'grey',
				      stroke: 'grey'
				  });

	this.fabricPaddle = new fabric.Group([line, line2, line3, line4], {
	    transformMatrix: [1,0,  0,1,  0,0]
	});
    }

    Paddle.prototype = {
	
    }

    return Paddle;
});
