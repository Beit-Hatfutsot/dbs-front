var FtreeViewController = function ($http, $window, $document, $rootScope,
							       $scope, $state, $stateParams, apiClient, ftreeLayout) {
	var self = this, script_loaded = true, node = {};

	this.$scope = $scope;
	this.$state = $state;
	this.$http = $http;
	this.$window = $window;
	this.apiClient = apiClient;

	// renderer
	this.rootId = "ftree-layout";
	this.layoutEngine = ftreeLayout;
	this.elements = {};
	this.vertices = {};
	this.treeNumber = $stateParams.tree_number;

	// TODO: get the size from the dom
	this.layoutEngine.setOptions(new Tuple(800, 500),  {
        // - individualSize: (w,h)
        individualSize: new Tuple(214,66),
        // - parentSize: (w,h)
        parentSize: new Tuple(152,52),
        // - partnerSize: (w,h)
        partnerSize: new Tuple(152,52),
        // - stepparentSize: (w,h)
        stepparentSize: new Tuple(52,52),
        // - childSize: (w,h)
        childSize: new Tuple(94,25),
        grandchildSize: new Tuple(25,25),
        // - inlawsSize: (w,h)
        inlawSize: new Tuple(25,25),
        // - siblingSize: (w,h)
        siblingSize: new Tuple(94,25),
        // - stepsiblingSize: (w,h)
        stepsiblingSize: new Tuple(25,25),
        // - siblingSize: (w,h)
        // - parentMargin: (horizontal,bottom)
        parentMargin: { horizontal:20, vertical:15, bottom:90},
        // - partnerMargin: (horizontal,vertical,left)
        partnerMargin: { horizontal:30, vertical:15, left:50 },
        // - childMargins: (horizontal,vertical,top)
        childMargin: { horizontal:40, vertical:15, top:60 },
        grandchildMargin: { horizontal:2, vertical:20, top:40 },
        // - inlawsMargins: (horizontal,vertical,top)
        inlawMargin: { horizontal:20, vertical:40, top:90 },
        // - siblingMargin: (horizontal,vertical,right)
        siblingMargin: { horizontal:10, vertical:25, right:30, top: -50 },
    });
	/* TODO: dynamiclly load d3
    var scriptTag = document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'js/lib/d3.min.js';
    scriptTag.onload = function () {
		self.d3 = $window.d3;
		var element = document.getElementById('tree-layout');
		self.layoutEngine.chartSize =  new Tuple(element.clientWidth, element.clientHeight);
		if (node != {})
			self.render(node);
	}
    var s = document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    */
	this.load($stateParams);
};

FtreeViewController.prototype = {

	get_fname: function(full_name) {
		return full_name[0];
	},

	load: function (params) {
		var self = this,
			apiUrl = this.apiClient.base_url+
				['', 'fwalk',  params.tree_number, params.node_id].join('/');

		this.$http.get(apiUrl, {
			cache: true
	  		})
			.success(function (response) {
				if (d3 != null)
					self.render(response)
				else
					console.log("where's d3?")
			})
			.error(function (response) {
				console.log('error walking the tree');
				console.log(response); 
			});

	},

	getElement: function (node,cls) {
		var ret;
		var id = node.id;
		if ( !this.elements[id] ) {
			this.elements[id] = {
				id: id,
				sex: node.sex,
				name: node.name,
				birth_year: node.birth_year,
				death_year: node.death_year
			}
		}
		ret = this.elements[id];
		ret.size = node.size;
		ret.pos = node.pos;
		ret.collapseto = node.collapseto;
		ret.class = cls;
		return ret;
	},

	getVertex:  function(node1,node2,cls) {
		var ret;
		var id = node1.id + node1.name + "->" + node2.id + node2.name;
		if ( !this.vertices[id] ) {
			this.vertices[id] = {
				id: id
			}
		}
		ret = this.vertices[id];
		if ( cls == 'spouse' ) {
			ret.start = new Tuple(node2.pos.x+node2.size.x/2,node1.spouse_ep.y);
		} else {
			ret.start = node2.pos.plus(node2.size.mult(0.5));
		}
		ret.end = node1[cls+'_ep'];
		if ( !ret.end ) {
			console.log('missing '+cls+'_ep for ',node1);
		}
		ret.collapseto = node1.collapseto;
		if ( node1.spouse_ofs && cls=='child' ) {
			ret.ofs = node1.spouse_ofs;
		} else {
			ret.ofs = 0;
		}
		ret.class = cls;
		return ret;
	},

	render: function(cn) {
		var self = this;
		if ( !cn.pos ) {
			this.layoutEngine.layoutNode(cn);
		}
		var data = [],
		    vdata = [];
		data.push( this.getElement(cn, 'individual') );
		if ( 'children' in cn ) {
			cn.children.forEach(function (child, _child) {
				data.push( self.getElement(child,'child') );
				if ( child.parent ) {
					vdata.push( self.getVertex(child.parent,child,'child') );
				} else {
					vdata.push( self.getVertex(cn,child,'child') );
				}
				if ( child.children ) {
					child.children.forEach(function (grandchild, _grandchild) {
						data.push( self.getElement(grandchild,'grandchild') );
						vdata.push( self.getVertex(grandchild.parent,grandchild,'child') );
					});
				}

				if ( child.partners ) {
					child.partners.forEach(function (inlaw, _inlaw) {
						data.push( self.getElement(inlaw,'inlaw') );
						vdata.push( self.getVertex(child, inlaw,'spouse') );
					});
				}
			})
		};
		if ( 'parents' in cn ) {
			cn.parents.forEach(function (parent, _parent) {
				data.push( self.getElement(parent,'parent') );
				if ( _parent == 0 ) {
					vdata.push( self.getVertex(parent,cn,'child') );
				} else {
					vdata.push( self.getVertex(cn.parents[0],parent,'spouse') );
				}
				if ( parent.parents ) {
					parent.parents.forEach( function (grandparent, _grandparent) {
						data.push( self.getElement(grandparent,'grandparent') );
						if ( _grandparent == 0 ) {
							vdata.push( self.getVertex(grandparent,parent,'child') );
						} else {
							vdata.push( self.getVertex(parent.parents[0],grandparent,'spouse') );
						}
					});
				}
				if ( parent.partners ) {
					parent.partners.forEach( function (stepparent, _stepparent) {
						// make sure it's really a stepparent
						if (stepparent.id != cn.parents[1-_parent].id) {
							data.push( self.getElement(stepparent,'stepparent') );
							vdata.push( self.getVertex(stepparent, parent, 'spouse') );
						}
						stepparent.children.forEach( function (stepsibling) {
							data.push( self.getElement(stepsibling,'stepsibling') );
							vdata.push( self.getVertex(stepparent, stepsibling, 'child') );
						});
					});
				}
			})
		};
		if ( 'partners' in cn ) {
			cn.partners.forEach(function (partner) {
				data.push( self.getElement(partner,'partner') );
				vdata.push( self.getVertex(partner,cn,'spouse') );
				partner.children.forEach(function (child) {
					data.push( self.getElement(child,'child') );
					vdata.push( self.getVertex(partner, child,'child') );
					child.partners.forEach(function (inlaw) {
						data.push( self.getElement(inlaw,'inlaw') );
						vdata.push( self.getVertex(inlaw, child, 'spouse') );
						inlaw.children.forEach(function (grandchild) {
							data.push( self.getElement(grandchild,'grandchild') );
							vdata.push( self.getVertex(inlaw, grandchild, 'child') );
						})
					})
				});
			})
		};
		if ( 'siblings' in cn ) {
			var parent = cn.parents[0];
			cn.siblings.forEach(function  (sibling, _sibling) {
				data.push( self.getElement(sibling,
										   sibling.step?'stepsibling':'sibling') );
				vdata.push( self.getVertex(parent, sibling, 'child') );
			})
		}

		function px(value) { return value + 'px'; };

		// NODES
		this.data = data;
		var els = d3.select('#' + this.rootId+" .nodes").selectAll(".node").data(data, function(d) { return d.id; });
		els.classed('old',true).classed('new', false);
		var new_els = els.enter();
		var old_els = els.exit();
		//var scope = this.$scope.$new(true);
		var new_divs = new_els.append('div');
		new_divs.classed('node', true)
			.classed('new', true)
			.on("click", function (d) { 
				var params = {node_id: d.id, tree_number: self.treeNumber}; 
				self.$state.transitionTo('ftree-view', params, {notify: false});
			    self.load(params);
			})
			.attr('role',function(d) { return d.hasOwnProperty('class') ? d.class : 'unknown'; })
			.attr('sex', function (d) { return d.hasOwnProperty('sex') ? d.sex : 'U';})
			.style('width',function(d) { return px(d.size.x); })
			.style('height',function(d) { return px(d.size.y); })

		
		new_divs.append('div')
				.classed('avatar', true)
		new_divs.append('div')
				.classed('dates', true).text(function(d) { 
				 	var birth = d.birth_year ? d.birth_year : '?';
				 	var death =  d.death_year ? d.death_year : '?';
				 	return birth + ' ' + death});
		new_divs.append('div')
			    .classed('name', true)
          .append('p', true).text(function(d) {
            return ['individual', 'partner', 'parent']
				   .indexOf(d.class) >= 0 ? d.name.join(" "):
					   				        self.get_fname(d.name)
            });


		var position_nodes = function(sel) {
			sel
				.style('opacity',1)
				.style('left',function(d) { return px(d.pos.x); })
				.style('top',function(d) { return px(d.pos.y); })
				.style('width',function(d) { return px(d.size.x); })
				.style('height',function(d) { return px(d.size.y); })
				.style('font-size',function(d) { 
					return d.class == 'individual'? "20px": px(d.size.y/2.5); })


		}

		var got_old = old_els.size() > 0;

		position_nodes( els.filter('.node.old')
				.attr('role',function(d) { return d.class; })
			    .attr('birth-year', function (d) { return d.hasOwnProperty('birth_year') ? d.birth_year : '?';})
			    .attr('death-year', function (d) { return d.hasOwnProperty('death_year') ? d.death_year : '?';})
				  .transition('reposition').duration(500).delay(got_old ? 500 : 0) );
		position_nodes( els.filter('.node.new')
			.transition('new_els').duration(500).delay(got_old ? 1000 : 0) );

		old_els
			.style('top',function(d) { return px(d.collapseto.y); })
			.style('left',function(d) { return px(d.collapseto.x); })
			.style('opacity',0)
			.transition('exit').duration(500)
			.remove()
			;


		els.selectAll("span")
			.style('width',function(d) { return px(d.size.x); })
			.style('height',function(d) { return px(d.size.y); })

		// VERTICES
		this.vdata = vdata;
		var vertices = d3.select('.vertices').selectAll(".vertex").data(vdata, function(d) { return d.id; }),
		    new_vxs = vertices.enter(),
		    old_vxs = vertices.exit(),
		    new_lines = new_vxs.append('path');
		vertices.attr('class','vertex old');

		var lineFunction = function(p) {
			var midpoint = (p.start.y + p.end.y) / 2;
			self.layoutEngine.midpoints.every(function (m, _m)  {
				if ( m > p.start.y && m < p.end.y || m < p.start.y && m > p.end.y) {
					midpoint = m;
					return false;
				}
				return true;
			});
			midpoint += p.ofs;
			return d3.svg.line()
                 		.x(function(d) { return d[0]; })
                 		.y(function(d) { return d[1]; })
                 		.interpolate("linear")
						([ [p.start.x, p.start.y], [p.start.x, midpoint], [p.end.x,midpoint], [p.end.x, p.end.y]]);
		}
		var tl = function(d) { // total length of a path
			if ( isNaN(Math.abs(d.start.x-d.end.x) + Math.abs(d.start.y-d.end.y)) ) {
				console.log('XXX',d);
			}
			return Math.abs(d.start.x-d.end.x) + Math.abs(d.start.y-d.end.y);
		}

		new_lines.attr('class','vertex new')
					   .style('opacity',0)
					   .style('stroke','black')
					   .style('stroke-width',1)
					   .style('fill','none')
					   .attr('d', function(d) { return lineFunction(d); })
					   .attr("stroke-dasharray",  function(d) { return tl(d) + " " + tl(d); })
					   .attr("stroke-dashoffset",  function(d) { return tl(d); });

		old_vxs
			.transition('remove-vertices').duration(500).ease('linear')
			.style('opacity',0)
			.attr("stroke-dashoffset",  function(d) { return tl(d); })
			.remove();

		
		this.pannedX = this.pannedY = 0;
		vertices.attr("transform", "translate(0,0)");
		var position_vertex = function(sel) {
			return sel.style('opacity',1)
			          .attr('d', function(d) { return lineFunction(d); })
					  .attr("stroke-dasharray",  function(d) { return tl(d) + " " + tl(d); })
					  .attr("stroke-dashoffset",  0);

		}

		position_vertex(
			vertices.filter('.vertex.old').transition('reposition-vertices')
					.delay(500)
					.duration(500).ease('linear')
		);

		position_vertex(
			vertices.filter('.vertex.new').transition('reposition-vertices')
					.delay(old_els.size() ? 1000 : 500)
					.duration(500).ease('linear')
		);
		this.d3Nodes = d3.select('#' + this.rootId + " .nodes")
			.selectAll(".node")
			.data(this.data, function(d) { return d.id; })
		this.d3Vertices = d3.select('.vertices')
			.selectAll(".vertex")
			.data(this.vdata, function(d) { return d.id; })
		this.lastPan = 0;
	},

	get_contributor_path: function() {
		return false;
	},
	mouseDown: function (e) {
		if (e.which == 1) {
			this.lastMouseX = e.clientX;
			this.lastMouseY = e.clientY;
			this.mousePressed = true;
			angular.element(document.getElementById(this.rootId))
				.css("cursor", "-webkit-grabbing")
		}
	},
	mouseUp: function (e) {
		if (e.which == 1) {
			this.mousePressed = false;
			angular.element(document.getElementById(this.rootId))
				.css("cursor", "all-scroll")
		}
	},
	pan: function (e) {
		if (!this.mousePressed)
			return;

		var self = this,
			x = e.clientX - this.lastMouseX,
			y = e.clientY - this.lastMouseY,
			elapsed = Date.now() - this.lastPan,
		    transform;
			
		if ( elapsed < 60 ) return; 
		this.pannedX += x;
		this.pannedY += y;
		transform = "translate("+this.pannedX+','+this.pannedY+")";

		this.lastMouseX = e.clientX;
		this.lastMouseY = e.clientY;

		function px(value) { return value + 'px'; };

		this.data.forEach(function (d) {
			d.pos.x += x;
			d.pos.y += y;
		});

		this.d3Nodes
			.transition('pan').duration(0)
			.style('left', function (d) { return px(d.pos.x);})
			.style('top', function (d) { return px(d.pos.y); });
		this.d3Vertices
			.transition('pan').duration(0)
			.attr('transform',  transform);
		d3.timer.flush();
		this.lastPan = Date.now()
	}
};

angular.module('main').controller('FtreeViewController', ['$http', '$window', '$document', '$rootScope', '$scope', '$state', '$stateParams', 'apiClient', 'ftreeLayout', FtreeViewController]);
