if (Object.prototype.isEmpty === undefined) {

	Object.prototype.isEmpty = function() {
		if (Object.keys(this).length === 0) {
			return true;
		}

		return false;
	}
}

if (Object.prototype.isNotEmpty === undefined) {

	Object.prototype.isNotEmpty = function() {
		if (Object.keys(this).length === 0) {
			return false;
		}

		return true;
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

if (Array.prototype.isNotEmpty === undefined) {

	Array.prototype.isNotEmpty = function() {
		if (this.length === 0) {
			return false;
		}

		return true;
	}
}
