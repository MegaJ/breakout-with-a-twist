Window.onload = define(["fabric.min", "math", "app/model", "app/paddle", "app/ball"],
		       function(fabric, mathjs, model, Paddlejs, Balljs) {
			   Window.fabric = fabric;
			   Window.math = math = mathjs;
			   Window.model = model;
			   Window.Paddle = Paddle = Paddlejs;
			   Window.Ball = Ball =  Balljs;
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
var game = function(time) {    
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
     
    canvas = new fabric.Canvas('game');
    Window.canvas = canvas;
    canvas.backgroundColor = "seashell";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    makeArrayOfBlocks();
    // makeBall();
    Window.paddle = paddle = new Paddle(PADDLE_LENGTH, PADDLE_WIDTH, 30);
    canvas.add(paddle.fabricPaddle);

    // ball extends fabric.Circle
    Window.ball = ball = new Ball(20, 5, 5, 'black');
    canvas.add(ball.fabricBall)
    ball.fabricBall.center()
	.setCoords();
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

// Using listeners instead
var processInput = function() {
    
}

var update = function(elapsed) {

}

var updatePaddle = function(matrix){
    
}

var render = function() {
    canvas.renderAll();
}

var addListeners = function() {
    translatePaddle();
}

var previousMouseCoord = {x: 0, y: 0};
var translatePaddle = function() {
     canvas.on('mouse:move', function(evt) {
	var currentMouseCoords = getMouseCoords(evt);
	var dx = currentMouseCoords.x - previousMouseCoord.x;
	var dy = currentMouseCoords.y - previousMouseCoord.y;
	// example of matrix multiplication
	var translate = [1, 0, 0, 1, dx, dy];
	var newTranslate = fabric.util.multiplyTransformMatrices(
	    Window.paddle.fabricPaddle.transformMatrix, translate);
	Window.paddle.fabricPaddle.transformMatrix = newTranslate;
	
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
