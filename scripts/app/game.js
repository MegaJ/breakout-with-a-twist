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
			   
			   // calls game once user ready to play
			   userReady(game);
		       });

// for 30 frames a second
var MS_PER_UPDATE = 1000 / 30;

// for now I don't want these dynamically changed
var BALL_RADIUS = 15;
var PADDLE_LENGTH = 80;
var PADDLE_WIDTH = 20;
var BRICK_WIDTH = 45;
var BRICK_HEIGHT = 20;
var LAG = 0.0;
var previous;

var userReady = function() {
    render();
    var fireGame = function () {
	document.removeEventListener("keydown", fireGame);
	var startTime = previous = performance.now();
	game(startTime);
    }
    
    document.addEventListener("keydown", fireGame);
}


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
	update(); // if there is a collision, should I force a render?
	LAG -= MS_PER_UPDATE;
    }

    // beware of possible negative LAG
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

    // TODO initialize paddle and ball start positions
    Window.paddle = paddle = new Paddle(PADDLE_LENGTH, PADDLE_WIDTH, 30);
    canvas.add(paddle.fabricPaddle);

    Window.ball = ball = new Ball(10, 9,
				  {radius: BALL_RADIUS,
				   fill: 'green',
				   originX: 'center',
				   originY: 'center',
				   transformMatrix: [1, 0,  0, 1, 0, 0]
				  });
    canvas.add(ball.fabricBall)
}

var makeRowOfBlocks = function(verticalOffset) {
    for (var i = 0; i < 5; i++) {

	// center each rectangle at (0,0)
	// then transform it to the correct location in view space
	var offset = 50;
	var brickCenterX = offset + BRICK_WIDTH/2 + (BRICK_WIDTH + 1)*i
	var brickCenterY = verticalOffset
	var fabricObj = {
	    originX: 'center',
	    originY: 'center',
	    width: BRICK_WIDTH,
	    height: BRICK_HEIGHT,
	    transformMatrix: [1,0,  0,1,  brickCenterX, brickCenterY]};
	
    	canvas.add(new Window.Brick(fabricObj).fabricRect);
    };
}

var makeArrayOfBlocks = function(){
    for (var i = 1; i <= 5; i++) {
	makeRowOfBlocks(i*30);
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

    var outOfBoundsRight = ballPosX + ball.dx > canvas.width - BALL_RADIUS;
    var outOfBoundsLeft = ballPosX + ball.dx < 0 + BALL_RADIUS;
    var outOfHorizontalBounds = outOfBoundsLeft || outOfBoundsRight;

    ballPosX = outOfBoundsRight ? canvas.width - BALL_RADIUS : ballPosX;
    ballPosX = outOfBoundsLeft ? 0 + BALL_RADIUS : ballPosX;
    ball.dx = outOfHorizontalBounds ? -ball.dx : ball.dx;

    var outOfBoundsTop = ballPosY + ball.dy > canvas.height - BALL_RADIUS;
    var outOfBoundsBottom = ballPosY + ball.dy < 0 + BALL_RADIUS;
    var outOfVerticalBounds = outOfBoundsTop || outOfBoundsBottom;

    ballPosY = outOfBoundsTop ? canvas.height - BALL_RADIUS : ballPosY;
    ballPosY = outOfBoundsBottom ? 0 + BALL_RADIUS : ballPosY;
    ball.dy = outOfVerticalBounds ? -ball.dy : ball.dy;

    var outOfBounds = outOfVerticalBounds || outOfHorizontalBounds;

    /* Set position explicitly to be inbounds. 
     * On next update, the ball's dx and dy will have been set
     * from the previous call to courtCollision, and jump to the else block
     */
    if (outOfBounds) {
	ball.fabricBall.transformMatrix = [1, 0,  0, 1,  ballPosX, ballPosY];
    } else {
	
	var translate = [1, 0, 0, 1, ball.dx, ball.dy];
	var newTranslate = fabric.util.
    	    multiplyTransformMatrices(ball.fabricBall.transformMatrix,
    				      translate);
	ball.fabricBall.transformMatrix = newTranslate;
    }
}

var deleteCollidedBrick = function(obj) {
    var brickCollision = false;
    if (obj.type === "rect") {
	brickCollision = ballBrickCollision(ball.fabricBall, obj);
	if (brickCollision) {
	    canvas.remove(obj);
	}
    }
}

var testVar = 1;
var update = function(elapsed) {
    courtCollision();

    // canvas only holds canvas objects..should I extend them in my own prototypes?
    var testBrick = canvas._objects[0];
    testBrick.set("fill", "red");
    canvas.forEachObject(deleteCollidedBrick);
}

// From http://stackoverflow.com/a/402010 checkout the picture to visualize
// this function can return an object with all the types of collisions
// pass in the fabricBall
var ballBrickCollision = function (circle, rectangle) {
    // Get center distances between ball and rectangle
    var xCentersDistance = Math.abs(getMatrixX(circle) - getMatrixX(rectangle));
    var yCentersDistance = Math.abs(getMatrixY(circle) - getMatrixY(rectangle));

    // collision is impossible because brick and circle
    // are horizontally too distant from each other
    if (xCentersDistance > (rectangle.width/2 + circle.radius)) {
	return false;
    }

    // collision is impossible like above, but for the vertical dim.
    if (yCentersDistance > (rectangle.height/2 + circle.radius)) {
	return false;
    }

    // xCenterDistance at this point is <= rectangle.width/2 + circle.radius
    // or the ball is at the corner.
    if (xCentersDistance <= rectangle.width/2) {return true;}
    if (yCentersDistance <= rectangle.height/2) {return true;}

    // corner collision, distance between center of circle and corner
    var xCornerDistance = xCentersDistance - rectangle.width/2;
    var yCornerDistance = yCentersDistance - rectangle.height/2

    // Check the diagonal of the square. The square is created
    // by the xCornerDistance and the yCornerDistance. Compare to radius.
    if (xCornerDistance*xCornerDistance + yCornerDistance*yCornerDistance
	<= circle.radius*circle.radius) {
	return true;
    } else {
	return false;
    }

    throw "Collision Detection doesn't catch all cases!";
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
