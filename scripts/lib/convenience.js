define([], function(){
    
    var convenience = {
	
	addMethod : function (methodName, fn) {
	    console.log("This: ", this);
	    this[methodName] = fn;
	    return this;
	}
    }

    return convenience;
});
