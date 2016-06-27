define(["fabric.min", "math"], function(fabricjs, math){

    var Brick = function(left, top, width, height) {
	
	this.fabricRect = new fabric.Rect({
	    left: left,
	    top: top,
	    width: width,
	    height: height,
	    transformMatrix: [1,0,  0,1,  0,0]});
    }

    return Brick;
});
