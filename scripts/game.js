require(["fabric.min"], function(dependency) {
    Window.fabric = dependency;
});

function game() { 
    initialize();
}

function initialize() {
     // create a wrapper around native canvas element (with id="c")
    canvas = new fabric.Canvas('game');
    Window.canvas = canvas;
    canvas.backgroundColor = "black";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    // create a rectangle object
    var rect = new fabric.Rect({
	left: 100,
	top: 100,
	fill: 'red',
	width: 20,
	get height() {
	    return this.width * 1.5;
	}
    });

    // "add" rectangle onto canvas
    canvas.add(rect);

    rect.set({ left: 20, top: 50 });

    var circle = new fabric.Circle({
	radius: 20, fill: 'green', left: 100, top: 100
    });
    canvas.add(circle);
    canvas.renderAll();
}

function processInput() {
    
}

function update() {

}

function render() {

}
window.onload = game;
