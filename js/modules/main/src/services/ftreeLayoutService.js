/**
 * Family tree layout engine
 */
angular.module('main').service('ftreeLayout', function() {

	this.setOptions = function (chartSize, layoutOptions) {
		this.chartSize = chartSize;
		this.options = layoutOptions;
	};

	this.layoutNode = function(node) {
		var center = this.chartSize.mult(0.5);
		var o = this.options;
		this.midpoints = [];

		node.pos = center.minus(o.individualSize.mult(0.5));
		node.size = o.individualSize;
		node.collapseto = node.pos;
		node.child_ep = node.pos.plus(node.size.mult(0.5));
		var parentHash = {};
		var stepparentHash = {};
		if ( node.parents ) {
			var grandparentRatio = o.parentSize.x/(o.parentMargin.horizontal + o.parentSize.x*2),
				numParents = node.parents.length;
			o.grandparentSize = o.parentSize.mult(grandparentRatio);
			if ( numParents>0 ) {
				var box = new Tuple(o.parentSize.x*numParents + o.parentMargin.horizontal*(numParents-1),
									o.parentSize.y + o.parentMargin.bottom + o.parentMargin.vertical);
				var left = center.x - box.x/2;
				var top = node.pos.y - box.y;
				node.parents.forEach(function (parent, _parent) {
					parentHash[parent.id] = parent;
					parent.pos = new Tuple(left,top);
					parent.size = o.parentSize;
					parent.collapseto = node.pos;
					// parent.child_ep = parent.pos.plus(parent.size.mult(0.5));
					parent.spouse_ep = parent.pos.plus(parent.size.mult(0.5));
					if ( _parent == 0 ) {
						parent.spouse_ofs = o.parentMargin.bottom / 2;
						if ( numParents == 1 ) {
							parent.child_ep = parent.pos.plus(parent.size.mult(0.5));
						} else {
							parent.child_ep = parent.pos.plus(parent.size.mult(0.5));
							parent.child_ep.x += parent.size.x/2 + o.parentMargin.horizontal/2;
						}
					}
					if ('parents' in parent) {
						var numGrandparents = parent.parents.length;
						parent.parents.forEach(function (grandparent, i) {
							grandparent.pos = new Tuple(parent.pos.x+i*grandparentRatio*(o.parentSize.x+o.parentMargin.horizontal),
								  parent.pos.y-2*o.grandparentSize.y);
							grandparent.size = o.grandparentSize;
							grandparent.collapseto = parent.pos;
							if ( i == 0 ) {
								if ( numGrandparents == 1 ) {
									grandparent.child_ep = grandparent.pos.plus(grandparent.size.mult(0.5));
								} else {
									grandparent.child_ep = grandparent.pos.plus(grandparent.size.mult(0.5));
									grandparent.child_ep.x += grandparent.size.x/2 + grandparentRatio*o.parentMargin.horizontal/2;
									grandparent.spouse_ep = grandparent.pos.plus(grandparent.size.mult(0.5));
								}
							}
						});
					}
					left += o.parentSize.x + o.parentMargin.horizontal;
				});
				this.midpoints.push(node.pos.y - o.parentMargin.bottom - o.parentMargin.vertical/2 );
				var dir = -1,
					left = center.x - box.x/2 - o.stepparentSize.x - o.parentMargin.horizontal,
					epOffset = (node.parents[0].partners.length-2) * 5;

				node.parents.forEach(function (parent, _parent) {
					if ('partners' in parent)
						parent.partners.forEach(function (stepparent, _stepParent) {
							if (!parentHash.hasOwnProperty(stepparent.id)) {
								stepparentHash[stepparent.id] = stepparent;
								stepparent.pos = new Tuple(left,top);
								stepparent.size = o.stepparentSize;
								console.log(parent.pos);
								stepparent.collapseto = parent.pos;
								stepparent.child_ep = stepparent.pos.plus(stepparent.size.mult(0.5));
								stepparent.child_ep.x -= dir*(stepparent.size.x/2 + o.parentMargin.horizontal/2);
								stepparent.child_ep.y += epOffset;
								stepparent.spouse_ep = stepparent.pos.plus(stepparent.size.mult(0.5));
								stepparent.spouse_ep.y += epOffset;
								stepparent.spouse_ofs = epOffset;
								left += dir*(o.stepparentSize.x + o.parentMargin.horizontal);
								epOffset += dir*5;
							}
						});
					// switch direction for the other parent
					dir = 1;
				    left = center.x + box.x/2 + o.parentMargin.horizontal;
					epOffset = node.parents[0].partners.length * 5;
				});
			}
		}
		var partnerHash = {};
		if ( node.partners ) {
			var numPartners = node.partners.length;
			if ( numPartners>0 ) {
				var box = new Tuple(o.partnerSize.x*numPartners + o.partnerMargin.horizontal*(numPartners-1),
									o.partnerSize.y);
				var left = center.x + node.size.x/2 + o.partnerMargin.left;
				var top = center.y - box.y/2;
				node.partners.forEach(function (partner, _partner) {
					partnerHash[partner.id] = partner;
					partner.pos = new Tuple(left,top);
					partner.size = o.partnerSize;
					partner.collapseto = node.pos;
					var spouse_ratio = (numPartners-parseInt(_partner))/(numPartners+1);
					partner.child_ep = new Tuple(partner.pos.x-o.partnerMargin.horizontal/3,
												 partner.pos.y+spouse_ratio*partner.size.y);
					partner.spouse_ep = new Tuple(partner.pos.x,
												 partner.pos.y+spouse_ratio*partner.size.y);
					partner.spouse_ofs = (spouse_ratio-0.5)*o.childMargin.vertical;
					left += o.partnerSize.x + o.partnerMargin.horizontal;
				});
			}
		}
		if ( node.children ) {
			var numChildren = node.children.length,
			    maxRatio =  o.childSize.x / ( 2*o.childSize.x + o.childMargin.horizontal ),
			    grandchildSize = o.childSize.mult(maxRatio),
			    minVertical = 2*grandchildSize.y;
			if ( minVertical > o.childMargin.vertical ) {
				o.childMargin.vertical = minVertical;
			}
			if ( numChildren>0 ) {
				var childrenPerRow =
					Math.floor((this.chartSize.x+o.childMargin.horizontal) / (o.childSize.x+o.childMargin.horizontal));
				if ( childrenPerRow < 1 ) { childrenPerRow = 1; };
				var idx = 0;
				var top = node.pos.y + node.size.y + o.childMargin.top + o.childMargin.vertical;
				this.midpoints.push(top - o.childMargin.vertical/2 );
				while ( numChildren > 0 ) {
					var rowSize = numChildren > childrenPerRow ? childrenPerRow : numChildren;
					var box = new Tuple(o.childSize.x*rowSize + o.childMargin.horizontal*(rowSize-1),
										o.childSize.y + o.childMargin.vertical);
					var left = center.x - box.x/2;
					while ( rowSize > 0 ) {
						var child = node.children[idx];
						numChildren --;
						rowSize --;
						idx ++;
						child.pos = new Tuple(left,top);
						child.size = o.childSize;
						child.child_ep = child.pos.plus(child.size.mult(0.5));
						child.collapseto = node.pos;
						if ( child.children && child.children.length > 0 ) {
							var numGrandchildren = child.children.length;
							var ratio = (o.childSize.x + o.childMargin.horizontal) / ( numGrandchildren*o.childSize.x + (numGrandchildren-1)*o.childMargin.horizontal );
							if ( ratio > maxRatio ) {
								ratio = maxRatio;
							}
							grandchildSize = o.childSize.mult(ratio);
							child.children.forEach( function (grandchild, _grandchild) {
								grandchild.pos = new Tuple(child.pos.x-o.childMargin.horizontal/2+_grandchild*ratio*(o.childSize.x+o.childMargin.horizontal),
									  child.pos.y+child.size.y+o.childMargin.vertical/4);
								grandchild.size = grandchildSize;
								grandchild.collapseto = child.pos;
							})
						}
						child.parents.every(function (parent, _parent) {
							if ( partnerHash[parent.id] ) {
								child.parent = partnerHash[parent.id];
								return false;
							}
							return true;
						});
						left += o.childSize.x + o.childMargin.horizontal;
					}
					top += o.childMargin.vertical + o.childSize.y;
				}
			}
		}
		if ( node.siblings ) {
			var numSiblings = node.siblings.length,
				numStepsiblings = 0;
			if ( numSiblings>0 ) {
				node.siblings.forEach(function (sibling, _sibling) {
					sibling.parent = node.parents[0];
					sibling.step = false;
					sibling.i = _sibling;
					sibling.parents.every(function (parent, _parent) {
						if ( stepparentHash[parent.id] ) {
							sibling.parent = stepparentHash[parent.id];
							sibling.step = true;
							numStepsiblings++;
							return false;
						}
						return true;
					});
				});
				var left = node.pos.x - node.size.x / 2; // - o.siblingMargin.right - node.size.x / 2;
				node.siblings.sort(function (n1, n2) {
					if (!n1.step && !n2.step)
						return n2.i - n1.i;
					if (!n1.step)
						return -1;
					if (!n2.step)
						return 1;
					if (n1.parent == n2.parent)
						return n2.i - n1.i;
					return n2.parent.pos.x - n1.parent.pos.x
				}).forEach (function (sibling, _sibling) {
					var top = node.pos.y + _sibling%2*(o.siblingSize.y+o.siblingMargin.vertical);
					sibling.size = sibling.step?o.stepsiblingSize:o.siblingSize;
					left -= sibling.size.x / 2 + o.siblingMargin.horizontal;
					sibling.pos = new Tuple(left,top);
					sibling.collapseto = sibling.parent.pos;

				});
			}
		}
	}
});

