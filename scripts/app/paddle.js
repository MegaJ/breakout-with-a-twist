define(["fabric.min", "math"], function(fabricjs, math){

    var calculateLeftSideTopPoint = function(vector_v, paddleWidth){
	var v_x = vector_v.x;
	var v_y = vector_v.y;
	
	var w_y = math.chain(v_x*v_x)
	    .divide(v_x*v_x + v_y*v_y)
	    .sqrt()
	    .done();
	
	var w_x = math.sqrt(1 - math.multiply(w_y, w_y));

	// sqrt allows us to use either the positive or negative root.
	if (v_y < 0) {w_x *= -1}

	console.log('w_y: ' + w_y);
	console.log('w_x: ' + w_x);

	// vector_w is a unit vector. 
	// Multiply by paddleWidth to obtain correct vector length
	var vector_w = {x: w_x*paddleWidth,
			y: w_y*paddleWidth};
	return vector_w;
    }

    var calculatePaddlePoints = function(length, width, angle) {
	
	var theta = 90 - angle;
	var pivot = {x : 0, y : 0};

	// canvas coordinate system is 0,0 for top left corner
	var rightBottom = {x: 0 + length * math.cos(math.unit(theta, 'deg')),
			   y: 0 - length * math.sin(math.unit(theta, 'deg'))}
	
	var sideA = width;
	var sideC = sideA / math.sin(math.unit(90 - theta, 'deg'));
	console.log("This is c: " + sideC);

	var offsetPivot = {x: 0, y: 0 - sideC};
	var vector_v = {x : rightBottom.x - 0,
			y: -1*(rightBottom.y - 0)};
	var vector_w = calculateLeftSideTopPoint(vector_v, width);
	var rightTop = {x: rightBottom.x - vector_w.x,
			y: rightBottom.y - vector_w.y};

	// vector_s is a reflection of vector_v
	var vector_s = {x: -1*(rightTop.x - offsetPivot.x),
			y: rightTop.y - offsetPivot.y};
	var leftTop = {x: offsetPivot.x + vector_s.x,
		       y: offsetPivot.y + vector_s.y};
	
	var vector_t = {x: -1*(rightBottom.x - 0),
			y: rightBottom.y - 0};
	var leftBottom = {x: 0 + vector_t.x,
			  y: 0 + vector_t.y};
	
	return {pivot: pivot,
		rightBottom: rightBottom,
		rightTop: rightTop,
		offsetPivot: offsetPivot,
		leftTop: leftTop,
		leftBottom: leftBottom}
    }
    
    var makeLine = function(point1, point2){
	return new fabric.Line(
	    [point1.x, point1.y,
	     point2.x, point2.y],
	    {fill: 'green', stroke: 'green'})
    }

    var Paddle = function(length, width, angle) {
	this.length = length;
	this.width = width;
	this.angle = angle;
	this.points = points = calculatePaddlePoints(length, width, angle);

	this.line1 = line1 = makeLine(points.pivot, points.rightBottom);
	this.line2 = line2 = makeLine(points.rightBottom, points.rightTop);
	this.line3 = line3 = makeLine(points.rightTop, points.offsetPivot);
	this.line4 = line4 = makeLine(points.offsetPivot, points.leftTop);
	this.line5 = line5 = makeLine(points.leftTop, points.leftBottom);
	this.line6 = line6 = makeLine(points.leftBottom, points.pivot);

	Window.line1 = line1, Window.line2 = line2, Window.line3 = line3, Window.line4 = line4, Window.line5 = line5, Window.line6 = line6;

	this.fabricPaddle = new fabric.Group([line1, line2, line3, line4, line5, line6],
					     {transformMatrix: [1,0,  0,1,  0,0]});
    }

    Paddle.prototype = {
	updatePaddleForm: function(length, width, angle) {
	    this.length = length;
	    this.width = width;
	    this.angle = angle;

	    this.paddlePoints = calculatePaddlePoints();
	}
	// can you just update the Group?
	// might be able to do fabricPaddle.insertAt(newFabricLine, index)
	// insert at automatically re-renders canvas
    }

    return Paddle;
});
