Window.onload = define(["fabric.min",
			"math",
			"app/model",
			"app/paddle",
			"app/ball",
		       "app/brick"],
		       function(fabric, mathjs, model, Paddlejs, Balljs, Brick) {
			   Window.fabric = fabric;
			   Window.math = math = mathjs;
			   Window.model = model;
			   Window.Paddle = Paddle = Paddlejs;
			   Window.Ball = Ball =  Balljs;
			   Window.Brick = Brick;
			   initialize();
			   addListeners();
			   
			   var startTime = performance.now();
			   game(startTime);
			});

// for 30 frames a second
var MS_PER_UPDATE = 1000 / 30;

// for now I don't want these dynamically changed
var BALL_RADIUS = 15;
var PADDLE_LENGTH = 80;
var PADDLE_WIDTH = 20;
var LAG = 0.0;

var previous = performance.now();
// game runs at a series of fixed time steps\
// the game function relies on requestAnimationFrame
// to invoke it as a callback. rAF will pass in a high res times stamp
var game = function(time) {

    var current = time;
    var elapsed = current - previous;

    previous = current;
    LAG += elapsed;
    
    processInput();

    while (LAG >= MS_PER_UPDATE) {
	update();
	LAG -= MS_PER_UPDATE;
    }

    render(LAG / MS_PER_UPDATE); // interpolation of rendering
   
    requestAnimationFrame(game);
}

var initialize = function () {
     
    canvas = new fabric.Canvas('game', {stateful: false, renderOnAddRemove: false});
    Window.canvas = canvas;
    canvas.backgroundColor = "grey";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    makeArrayOfBlocks();
    Window.paddle = paddle = new Paddle(PADDLE_LENGTH, PADDLE_WIDTH, 30);
    canvas.add(paddle.fabricPaddle);

    // ball extends fabric.Circle
    Window.ball = ball = new Ball(10, 9,
				  {radius: 20,
				   fill: 'green',
				   originX: 'center',
				   originY: 'center',
				   transformMatrix: [1, 0,  0, 1, 0, 0]
				  });
    canvas.add(ball.fabricBall)
    // ball.fabricBall.center()
    // 	.setCoords();
}

var makeRowOfBlocks = function(verticalSpace) {
    for (var i = 0; i < 5; i++) {
	// width is 30
    	canvas.add(new Window.Brick(50*i + 100, verticalSpace,
    	     		     30, 30 * 0.5).fabricRect);
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

var getMatrixX = function(fabricObj) {
    return fabricObj.transformMatrix[4];
}

var getMatrixY = function(fabricObj) {
    return fabricObj.transformMatrix[5];
}

// courtCollision is preemptive: if the ball will hit something
// the ball is set to a position where it makes contact with the wall
// and it's direction is reversed
var courtCollision = function() {

    var ballPosX = getMatrixX(ball.fabricBall);
    var ballPosY = getMatrixY(ball.fabricBall);
    
    var outOfBoundsRight = ballPosX + ball.dx >= canvas.width - BALL_RADIUS;
    var outOfBoundsLeft = ballPosX + ball.dx <= 0 + BALL_RADIUS;
    var outOfHorizontalBounds = outOfBoundsLeft || outOfBoundsRight;

    ballPosX = outOfBoundsRight ? canvas.width - BALL_RADIUS : ballPosX;
    ballPosX = outOfBoundsLeft ? 0 + BALL_RADIUS : ballPosX;
    ball.dx = outOfHorizontalBounds ? -ball.dx : ball.dx;

    var outOfBoundsTop = ballPosY + ball.dy >= canvas.height - BALL_RADIUS;
    var outOfBoundsBottom = ballPosY + ball.dy <= 0 + BALL_RADIUS;
    var outOfVerticalBounds = outOfBoundsTop || outOfBoundsBottom;

    // Warning: not sure if canvas.width is safe to use
    ballPosY = outOfBoundsTop ? canvas.height - BALL_RADIUS : ballPosY;
    ballPosY = outOfBoundsBottom ? 0 + BALL_RADIUS : ballPosY;
    ball.dy = outOfVerticalBounds ? -ball.dy : ball.dy;

    var outOfBounds = outOfVerticalBounds || outOfHorizontalBounds;

    // Set position explicitly. If the if-block isn't entered,
    // just translate the ball as usual.
    if (outOfBounds) {
	ball.fabricBall.transformMatrix = [1, 0,  0, 1,  ballPosX, ballPosY];
    }
    
    var translate = [1, 0, 0, 1, ball.dx, ball.dy];
    var newTranslate = fabric.util.
    	multiplyTransformMatrices(ball.fabricBall.transformMatrix,
    				  translate);
    ball.fabricBall.transformMatrix = newTranslate;
}

var update = function(elapsed) {
    courtCollision();
    // 
}

var updatePaddle = function(matrix){
    
}

var render = function() {
    canvas.renderAll();
}

var addListeners = function() {
    translatePaddle();
    morphPaddle();
}

var previousMouseCoord = {x: 0, y: 0};
var currentMouseCoords = {x: 0, y: 0};

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

var morphPaddle = function() {
    document.addEventListener("keydown", function(evt) {
	var keyCode = evt.keyCode;
	if (keyCode === 65) {
	    paddle.updatePaddleForm(PADDLE_LENGTH, PADDLE_WIDTH, paddle.angle + 5);
	} else if (keyCode === 83) {
	    paddle.updatePaddleForm(PADDLE_LENGTH, PADDLE_WIDTH, paddle.angle - 5);
	}
	
    });
}

var getMouseCoords = function(event) {
    var pointer = canvas.getPointer(event.e);
    return {
	x: pointer.x,
	y: pointer.y
    }; 
}
