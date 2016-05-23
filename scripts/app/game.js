Window.onload = define(["fabric.min", "math", "app/model"],
			function(fabric, mathjs, model) {
			    Window.fabric = fabric;
			    Window.math = math = mathjs;
			    Window.model = model;
			    initialize();
			    addListeners();
			    game();
			});

// for 60 frames a second
var MS_PER_UPDATE = 1000 / 30;

// for now I don't want these dynamically changed
var BALL_RADIUS = 15;
var PADDLE_LENGTH = 80;
var PADDLE_WIDTH = 20;
var LAG = 0.0;

// game runs at a series of fixed time steps
var game = function() {    
    var previous = new Date().getTime();    
    var current = new Date().getTime();
    var elapsed = current - previous;
    previous = current;
    LAG += elapsed;
    
    processInput();

    while (LAG >= MS_PER_UPDATE) {
	update();
	LAG -= MS_PER_UPDATE;
    }

    render(LAG / MS_PER_UPDATE);
    
    requestAnimationFrame(game);
}

var initialize = function () {
     // create a wrapper around native canvas element (with id="c")
    canvas = new fabric.Canvas('game');
    Window.canvas = canvas;
    canvas.backgroundColor = "seashell";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    makeArrayOfBlocks();
    makeBall();
    makePaddle(PADDLE_LENGTH, PADDLE_WIDTH, 100);
}

var makeBall = function (){
    Window.ball = ball = new fabric.Circle({
	radius: BALL_RADIUS,
	fill: 'green'
    });
    canvas.add(ball);
    ball.center()
	.setCoords();

    ball.velocity = {dx: 5, dy: 5};
    ball.set({transformMatrix: [1, 0,  0, 1,  5, 5]});
    console.log(ball);
}

var makePaddle = function (length, width, angle) {
    var theta = 90 - angle;
    var pivot = {x : 0, y : 0};
    
    // canvas coordinate system is 0,0 for top left corner
    var right_side_top = {x: 0 + length * math.cos(math.unit(theta, 'deg')),
			  y: 0 - length * math.sin(math.unit(theta, 'deg'))}
    
    line = new fabric.Line([pivot.x, pivot.y,
			    right_side_top.x, right_side_top.y], {
	fill: 'black',
	stroke: 'black'
    });
    //canvas.add(line);
    Window.line = line;

    var sideA = width;
    var sideC = sideA / math.sin(math.unit(90 - theta, 'deg'));
    console.log("This is c: " + sideC);
    var offsetPoint = {x: 0, y: 0 - sideC};

    var vector_v = {x : right_side_top.x - 0,
		    y: -1*(right_side_top.y - 0)};
    var vector_w = calculateLeftSideTopPoint(vector_v, width);
    var leftSideTop = {x: right_side_top.x - vector_w.x,
		       y: right_side_top.y - vector_w.y};

    
    console.log(leftSideTop);
    line2 =  new fabric.Line([offsetPoint.x, offsetPoint.y,
			    leftSideTop.x, leftSideTop.y], {
	fill: 'red',
	stroke: 'red'
			    });
    //canvas.add(line2);
    Window.line2 = line2;

    // vector_s is a reflection of vector_v
    var vector_s = {x: -1*(leftSideTop.x - offsetPoint.x),
		    y: leftSideTop.y - offsetPoint.y}
    var leftPartLeftSideTop = {x: offsetPoint.x + vector_s.x,
			       y: offsetPoint.y + vector_s.y}
    
     line3 =  new fabric.Line([offsetPoint.x, offsetPoint.y,
			    leftPartLeftSideTop.x, leftPartLeftSideTop.y], {
	fill: 'orange',
	stroke: 'orange'
			    });
    //canvas.add(line3);
    Window.line2 = line3;

    var vector_t = {x: -1*(right_side_top.x - 0),
		    y: right_side_top.y - 0}
    var leftPartLeftSideBottom = {x: 0 + vector_t.x,
				  y: 0 + vector_t.y};

    line4 =  new fabric.Line([0, 0,
			    leftPartLeftSideBottom.x, leftPartLeftSideBottom.y], {
	fill: 'grey',
	stroke: 'grey'
			    });
    //canvas.add(line4);
    Window.line2 = line4;

    paddle2 = new fabric.Group([line, line2, line3, line4], {
	transformMatrix: [1,0,  0,1,  0,0]
    });
    Window.paddle2 = paddle2;
    canvas.add(paddle2);

    paddle =  new fabric.Polygon([
	pivot,
	right_side_top,
	leftSideTop,
	offsetPoint,
	leftPartLeftSideTop,
	leftPartLeftSideBottom
    ], {
	stroke: 'blue',
	fill: 'rgba(0,0,255,0.75)',
	strokeWidth: 3,
	transformMatrix: [1,0,  0,1,  0,0]
    });
    Window.paddle = paddle;
    canvas.add(paddle);
}

// createPerpendicularVectorTo(vector_v)
var calculateLeftSideTopPoint = function(vector_v, paddleWidth){
    var v_x = vector_v.x;
    var v_y = vector_v.y;
    
    var w_y = math.chain(v_x*v_x)
	.divide(v_x*v_x + v_y*v_y)
	.sqrt()
	.done();
    console.log('w_y: ' + w_y);
    var w_x = math.sqrt(1 - math.multiply(w_y, w_y));

    console.log('w_x: ' + w_x);
    // multiply by the scalar paddleWidth
    // flip w_x, w_y to negative because of screen coordinate system
    var vector_w = {x: w_x*paddleWidth,
		    y: w_y*paddleWidth};
    return vector_w;
}

var makeRowOfBlocks = function(verticalSpace) {
    for (var i = 0; i < 5; i++) {
    	canvas.add(new fabric.Rect({
    	    left: 50*i + 100,
    	    top: verticalSpace,
    	    fill: 'red',
    	    width: 30,
    	    get height() {
    		return this.width * 0.5;
    	    }
    	}));
    };
}

var makeArrayOfBlocks = function(){
    for (var i = 1; i <= 5; i++) {
	makeRowOfBlocks(i*30)
    }
}

var processInput = function() {
    
}

var update = function(elapsed) {

}

var updatePaddle = function(matrix){
    
}

var render = function() {
    canvas.renderAll();
}

var previousMouseCoord = {x: 0, y: 0};
var addListeners = function() {
    canvas.on('mouse:move', function(evt) {
	var currentMouseCoords = getMouseCoords(evt);
	var dx = currentMouseCoords.x - previousMouseCoord.x;
	var dy = currentMouseCoords.y - previousMouseCoord.y;
	// example of matrix multiplication
	var translate = [1, 0, 0, 1, dx, dy];
	var newTranslate = fabric.util.multiplyTransformMatrices(
	    Window.paddle2.transformMatrix, translate);
	Window.paddle2.set({transformMatrix: newTranslate});
	
	//console.log(paddle.setCoords());
	//console.log("Mouse: x: " + currentMouseCoords.x +
	//	    " y: " + currentMouseCoords.y);
	
	previousMouseCoord = currentMouseCoords;
    }, false);    
}

var getMouseCoords = function(event) {
    var pointer = canvas.getPointer(event.e);
    return {
	x: pointer.x,
	y: pointer.y
    }; 
}
