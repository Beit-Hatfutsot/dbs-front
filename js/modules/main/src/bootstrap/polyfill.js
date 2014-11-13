if (Object.prototype.isEmpty === undefined) {

	Object.prototype.isEmpty = function() {
		if (Object.keys(this).length === 0) {
			return true;
		}

		return false;
	}
}

if (Array.prototype.isEmpty === undefined) {

	Array.prototype.isEmpty = function() {
		if (this.length === 0) {
			return true;
		}

		return false;
	}
}
