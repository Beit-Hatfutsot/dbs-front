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
		var self = this;

		function layoutCluster(cluster, args) {
			if (cluster === undefined)
				return;

			var lastChild = cluster.length - 1,
				dir = -1,
				childLeft,
				childTop;
			// figure the starting top center point
			if (args.hasOwnProperty("topCenter")) {
				childTop = args.topCenter.y; //+args.childMargin.top;
				childLeft = args.topCenter.x-args.childSize.x/2
			} else {
				var clusterWidth;
				childTop = args.topRight.y; //+args.childMargin.top;
				if (cluster.length == 1)
					clusterWidth = args.childSize.x
				else if (cluster.length < 4)
					clusterWidth = args.childSize.x*2+args.childMargin.horizontal*2
				else
					clusterWidth = args.childSize.x*4+args.childMargin.horizontal*2;

				childLeft = args.topRight.x-clusterWidth/2-args.childSize.x/2;
			}
			var minLeft = 99999;
			cluster.forEach( function (child, _child) {
				var row = Math.floor(_child / 2),
					marginX ;
				if ((_child == lastChild) && (_child % 2 == 0))
					marginX = 0
				else
					marginX = args.childSize.x*(1 + row%2)/2+args.childMargin.horizontal;

				child.pos = new Tuple(childLeft+dir*marginX,
							  childTop+args.childMargin.vertical*row);
				if (child.pos.x < minLeft)
					minLeft = child.pos.x;
				child.size = args.childSize;
				child.collapseto = args.collapseTo.pos;
				dir=dir*-1;
			})
			return new Tuple(minLeft - args.childMargin.horizontal, childTop);
		}

		node.pos = center.minus(o.individualSize.mult(0.5));
		node.size = o.individualSize;
		node.collapseto = node.pos;
		node.child_ep = node.pos.plus(node.size.mult(0.5));
		var parentHash = {};
		var stepparentHash = {};
		var siblingsTopRight = new Tuple(node.pos.x - o.siblingMargin.horizontal,
									     node.pos.y) ;
		if ( node.parents ) {
			var grandparentRatio = o.parentSize.x/(o.parentMargin.horizontal + o.parentSize.x*2),
				numParents = node.parents.length;
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
					parent.spouse_ep = parent.pos.plus(parent.size.mult(0.5));
					if ( _parent == 0 ) {
						parent.spouse_ofs = o.parentMargin.bottom / 3;
						if ( numParents == 1 ) {
							parent.child_ep = parent.pos.plus(parent.size.mult(0.5));
						} else {
							parent.child_ep = parent.pos.plus(parent.size.mult(0.5));
							parent.child_ep.x += parent.size.x/2 + o.parentMargin.horizontal/2;
						}
						// layout the siblings - step siblings not included
						var numSiblings = node.siblings.length;
						if (numSiblings > 0) {
							var clusterWidth = (numSiblings < 2)?
								o.siblingSize.x:
								(o.siblingSize.x+o.siblingMargin.horizontal)*2;
							parent.cluster_ep = new Tuple(node.pos.x - o.siblingMargin.horizontal-clusterWidth/2,
														 node.pos.y + o.siblingMargin.top);
							siblingsTopRight  = layoutCluster (node.siblings, {
								childMargin: o.siblingMargin,
								childSize: o.siblingSize,
								topCenter: parent.cluster_ep,
								collapseTo: node
							});
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
				this.midpoints.push(node.pos.y + node.size.y/2 - o.parentMargin.bottom - o.parentMargin.vertical/2 );
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
								stepparent.collapseto = parent.pos;
								stepparent.child_ep = stepparent.pos.plus(stepparent.size.mult(0.5));
								stepparent.child_ep.x -= dir*(stepparent.size.x/2 + o.parentMargin.horizontal/2);
								stepparent.child_ep.y += epOffset;
								stepparent.spouse_ep = stepparent.pos.plus(stepparent.size.mult(0.5));
								stepparent.spouse_ep.y += epOffset;
								stepparent.spouse_ofs = epOffset;
								// layout the step siblings
								if (stepparent.hasOwnProperty('children') && (stepparent.children.length > 0)) {
									var clusterLen = stepparent.children.length,
										clusterWidth = (clusterLen < 2)?
											o.stepsiblingSize.x:
 											(o.stepsiblingSize.x+o.siblingMargin.horizontal)*2;
									stepparent.cluster_ep = new Tuple(siblingsTopRight.x-clusterWidth/2,
															 siblingsTopRight.y);

									siblingsTopRight = layoutCluster (stepparent.children, {
										childMargin: o.siblingMargin,
										childSize: o.stepsiblingSize,
										topCenter: stepparent.cluster_ep,
										collapseTo: stepparent
									});
								}
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
		if ( node.partners ) {
			var numPartners = node.partners.length;
			if ( numPartners>0 ) {
				var box = new Tuple(o.partnerSize.x*numPartners + o.partnerMargin.horizontal*(numPartners-1),
									o.partnerSize.y);
				var left = center.x + node.size.x/2 + o.partnerMargin.left;
				var top = center.y - box.y/2;
				var numChildren = 0;
				var numInlaws = 0;

				// children are under the partners
				node.partners.forEach(function (partner, _partner) {
					numChildren += partner.children.length;
					partner.children.forEach(function (child, _child) {
						numInlaws += child.partners.length;
					})
				})

				var childLeft, childTop, dir,
					childMarginX = o.childMargin.horizontal,
					childrenBoxWidth = o.childSize.x*numChildren + (o.inlawMargin.horizontal + o.inlawSize.x)*numInlaws + childMarginX*(numChildren-1);

				if (childrenBoxWidth > self.chartSize.x) {
					// TODO handle many children
					childrenBoxWidth -= childMarginX*(numChildren-1);
					childMarginX = 0;
					dir = 1;
					childTop = node.pos.y + node.size.y + o.childMargin.top +o.childSize.y * 1.2
				}
				else {
					dir = 0;
					childTop = node.pos.y + node.size.y + o.childMargin.top;
				}
				if (numChildren > 0)
				{
					this.midpoints.push((node.pos.y+node.size.y + childTop) / 2);
				}

				childLeft = center.x - childrenBoxWidth/2;

				node.partners.forEach(function (partner, _partner) {
					partner.pos = new Tuple(left,top);
					partner.size = o.partnerSize;
					partner.collapseto = node.pos;
					var spouse_ratio = (numPartners-parseInt(_partner))/(numPartners+1);
					partner.spouse_ep = new Tuple(partner.pos.x,
												 partner.pos.y+spouse_ratio*partner.size.y);
					partner.spouse_ofs = (spouse_ratio-0.5)*o.childMargin.vertical;
					left += o.partnerSize.x + o.partnerMargin.horizontal;
					partner.child_ep = new Tuple(partner.pos.x-o.partnerMargin.horizontal/3,
												 partner.pos.y+spouse_ratio*partner.size.y);
					partner.children.forEach( function (child, _child) {
						child.pos = new Tuple(childLeft, childTop);
						child.size = o.childSize;
						child.collapseto = partner.pos;
						if (! child.hasOwnProperty("partners"))
							return
						childLeft += child.size.x;
						var numInlaws = child.partners.length;
						child.partners.forEach( function (inlaw, _inlaw) {
							var spouse_ratio = (numInlaws-parseInt(_inlaw))/(numInlaws+1);
							childLeft += o.inlawMargin.horizontal;
							inlaw.pos = new Tuple(childLeft, childTop);
							inlaw.size = o.inlawSize;
							inlaw.spouse_ep = new Tuple(inlaw.pos.x,
														inlaw.pos.y+spouse_ratio*inlaw.size.y);
							inlaw.spouse_ofs = (spouse_ratio-0.5)*o.inlawMargin.vertical;
							inlaw.collapseto = child.pos;
							childLeft += inlaw.size.x;
							inlaw.child_ep = new Tuple(inlaw.pos.x-o.inlawMargin.horizontal/3,
													   inlaw.pos.y+spouse_ratio*inlaw.size.y);

							inlaw.cluster_ep = new Tuple(inlaw.child_ep.x,
														 inlaw.child_ep.y+o.grandchildMargin.top);
							// layout some gradnchildren
							layoutCluster (inlaw.children, {
								childMargin: o.grandchildMargin,
								childSize: o.grandchildSize,
								topCenter: inlaw.cluster_ep,
								collapseTo: inlaw
							});
						});
						childLeft += childMarginX;
						childTop  += dir*o.childSize.y*1.2;
						dir = dir*-1;
					})
				});
			}
		}
	}
});

