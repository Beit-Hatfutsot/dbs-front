if (Object.prototype.isEmpty === undefined) {
    /*
    Object.prototype.isEmpty = function() {
        if (Object.keys(this).length === 0) {
            return true;
        }

        return false;
    }
    */
    Object.defineProperty(Object.prototype, 'isEmpty', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() {
            if (Object.keys(this).length === 0) {
                return true;
            }

            return false;
        }
    });
}

if (Object.prototype.isNotEmpty === undefined) {
    /*
    Object.prototype.isNotEmpty = function() {
        if (Object.keys(this).length === 0) {
            return false;
        }

        return true;
    }
    */
    Object.defineProperty(Object.prototype, 'isNotEmpty', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() {
            if (Object.keys(this).length === 0) {
                return false;
            }

            return true;    
        }
    });
}

if (Array.prototype.isEmpty === undefined) {
    /*
    Array.prototype.isEmpty = function() {
        if (this.length === 0) {
            return true;
        }

        return false;
    }
    */
    Object.defineProperty(Array.prototype, 'isEmpty', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
            if (this.length === 0) {
                return true;
            }

            return false;
        }
    });
}

if (Array.prototype.isNotEmpty === undefined) {
    /*
    Array.prototype.isNotEmpty = function() {
        if (this.length === 0) {
            return false;
        }

        return true;
    }
    */
    Object.defineProperty(Array.prototype, 'isNotEmpty', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
            if (this.length === 0) {
                return false;
            }

            return true;
        }
    });
}
