/**
 * A simple tuple of x,y pair
 */
Tuple = (function(){
	var C = function(){ return constructor.apply(this,arguments); }
	var p = C.prototype;

	//list the attributes
	p.x;
    p.y;

	//construct
	function constructor(x,y){
		this.x = x;
        this.y = y;
	}

	p.plus = function(other) {
		return new Tuple(this.x+other.x,this.y+other.y);
	}

	p.minus = function(other) {
		return new Tuple(this.x-other.x,this.y-other.y);
	}

	p.mult = function(a) {
		return new Tuple(this.x*a, this.y*a)
	}

	//unleash your class
	return C;
})();
