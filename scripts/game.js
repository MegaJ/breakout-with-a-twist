Window.onload = require(["fabric.min", "math", "model"],
			function(fabric, mathjs, model) {
			    Window.fabric = fabric;
			    Window.math = math = mathjs;
			    Window.model = model;
			    initialize();
			    addListeners();
			    game();
			});

// for 60 frames a second
var MS_PER_UPDATE = 1000 / 60;

// for now I don't want these dynamically changed
var BALL_RADIUS = 15;
var PADDLE_LENGTH = 80;
var PADDLE_WIDTH = 20;

// game runs at a series of fixed time steps
function game() {    
    var previous = new Date().getTime();
    var lag = 0.0;
    
    var current = new Date().getTime();
    var elapsed = current - previous;
    previous = current;
    lag += elapsed;
    
    processInput();

    while (lag >= MS_PER_UPDATE) {
	update();
	lag -= MS_PER_UPDATE;
    }

    render(lag / MS_PER_UPDATE);
    
    requestAnimationFrame(game);
}

function initialize() {
     // create a wrapper around native canvas element (with id="c")
    canvas = new fabric.Canvas('game');
    Window.canvas = canvas;
    canvas.backgroundColor = "black";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    makeRowOfBlocks(100);
    makeBall();
    makePaddle(canvasWidth/2, canvasHeight/2,
	       PADDLE_LENGTH, PADDLE_WIDTH, 45);
}

var makeBall = function (){
    Window.ball = ball = new fabric.Circle({
	radius: BALL_RADIUS,
	fill: 'green'
    });
    canvas.add(ball);
    ball.center()
	.setCoords();
    console.log(ball);
}

var makePaddle = function (x, y, length, width, angle) {
    //angle = angle * (Math.PI/180); // convert to radians
    
    var theta = 90 - angle;
    var pivot = {x : x, y : y};

    // canvas coordinate system is 0,0 for top left corner
    var right_side_top = {x: x + length * math.cos(math.unit(theta, 'deg')),
			  y: y - length * math.sin(math.unit(theta, 'deg'))}
    console.log(right_side_top)
    line = new fabric.Line([pivot.x, pivot.y,
			    right_side_top.x, right_side_top.y], {
	fill: 'green',
	stroke: 'green'
    });
    canvas.add(line);
    Window.line = line;

    var offsetPoint = {x: x, y: pivot.y - width};
    var left_side_top = {}
    line2 =  new fabric.Line([offsetPoint.x, offsetPoint.y,
			    right_side_top.x, right_side_top.y], {
	fill: 'red',
	stroke: 'red'
			    });
    canvas.add(line2);
    Window.line2 = line2;
    
    
    paddle =  new fabric.Polygon([
	{ x: 10, y: 10 },
	{ x: 50, y: 30 },
	{ x: 40, y: 70 },
	{ x: 60, y: 50 },
	{ x: 100, y: 150 },
	{ x: 40, y: 100 }
    ], {
	stroke: 'blue',
	fill: 'rgba(0,0,255,0.75)',
	strokeWidth: 3
    });
    Window.paddle = paddle;

    //console.log(paddle.)
    canvas.add(paddle);
}

var makeRowOfBlocks = function(verticalSpace) {
    for (var i = 0; i < 5; i++) {
    	canvas.add(new fabric.Rect({
    	    left: 50*i + 100,
    	    top: verticalSpace,
    	    fill: 'red',
    	    width: 30,
    	    get height() {
    		return this.width * 0.75;
    	    }
    	}));
    };
}

function processInput() {
    
}

function update(elapsed) {

}

function render() {
    canvas.renderAll();
}

function addListeners() {
    canvas.on('mouse:move', function(evt) {
	var mouseCoords = getMouseCoords(evt);

	// example of matrix multiplication
	var translate = [1, 0,  0, 1,  30, 30];
	var translate2 = [1, 0,  0, 1,  100, 100];
	var translateSum = fabric.util.multiplyTransformMatrices(translate, translate2);
	
	console.log(paddle.setCoords());
	console.log("Mouse: x: " + mouseCoords.x +
		    " y: " + mouseCoords.y);
    }, false);    
}

function getMouseCoords(event) {
    var pointer = canvas.getPointer(event.e);
    return {
	x: pointer.x,
	y: pointer.y
    }; 
}
