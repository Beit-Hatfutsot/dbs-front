var FtreeViewController = function($http, $window, $document, $scope, $state,
								   $stateParams, apiClient, ftreeLayout) {
	var self = this, script_loaded = true, node = {};

	this.$scope = $scope;
	this.$state = $state;
	this.$stateParams = $stateParams;
	this.d3 = $window.d3;
	this.$http = $http;
	this.apiClient = apiClient;

	// renderer
	this.selector = "#ftree-layout";
	this.layoutEngine = ftreeLayout;
	this.elements = {};
	this.vertices = {};

	this.layoutEngine.setOptions(new Tuple(800, 600),  {
        // - individualSize: (w,h)
        individualSize: new Tuple(160,50),
        // - parentSize: (w,h)
        parentSize: new Tuple(120,30),
        // - stepparentSize: (w,h)
        stepparentSize: new Tuple(30,30),
        // - partnerSize: (w,h)
        partnerSize: new Tuple(120,30),
        // - childSize: (w,h)
        childSize: new Tuple(100,25),
        // - siblingSize: (w,h)
        siblingSize: new Tuple(100,25),
        // - stepsiblingSize: (w,h)
        stepsiblingSize: new Tuple(25,25),
        // - parentMargin: (horizontal,bottom)
        parentMargin: { horizontal:20, vertical:15, bottom:90},
        // - partnerMargin: (horizontal,vertical,left)
        partnerMargin: { horizontal:30, vertical:15, left:50 },
        // - childMargins: (horizontal,vertical,top)
        childMargin: { horizontal:40, vertical:40, top:90 },
        // - siblingMargin: (horizontal,vertical,right)
        siblingMargin: { horizontal:15, vertical:10, right:30 },
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

	 console.log(apiClient);
	 // TODO: get the fwalk from the apiClient
	var params = {i: $stateParams.i};
	if ('t' in $stateParams)
		params.t = $stateParams.t;
	this.load(params);
};

FtreeViewController.prototype = {

	load: function (params) {
		var self = this;

		this.$http.get(this.apiClient.base_url+"/fwalk", {
					params: params,
					cache: true 
				  }).
			 success(function (response) {
				 if (self.d3 != null)
					self.render(response)
				else 
					console.log("where's d3?")
			 }).
			 error(function (response) {
				 console.log('error walking the tree');
				 console.log(response); 
			 });
	},
	getElement: function(node,cls) {
		var ret;
		var id = node.id;
		if ( !this.elements[id] ) {
			this.elements[id] = {
				id: id,
				sex: node.sex,
				name: node.name
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
						vdata.push( self.getVertex(child,grandchild,'child') );
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
					});
				}
			})
		};
		if ( 'partners' in cn ) {
			cn.partners.forEach(function (partner, _partner) {
				data.push( self.getElement(partner,'partner') );
				vdata.push( self.getVertex(partner,cn,'spouse') );
			})
		};
		if ( 'siblings' in cn ) {
			cn.siblings.forEach(function  (sibling, _sibling) {
				data.push( self.getElement(sibling,
										   sibling.step?'stepsibling':'sibling') );
				vdata.push( self.getVertex(sibling.parent, sibling, 'child') );
			})
		}

		function px(value) { return value + 'px'; };

		// NODES
		var els = this.d3.select(this.selector+" .nodes").selectAll(".node").data(data, function(d) { return d.id; });
		els.attr('class','node old');
		var new_els = els.enter();
		var old_els = els.exit();
		var new_divs = new_els.append('div');
		new_divs.attr('class','node new')
					   .style('opacity',0)
					   .on("click", function (d) {
							self.load({i: d.id});
					   })
					   .style('top',function(d) { return px(d.collapseto.y); })
		   			   .style('left',function(d) { return px(d.collapseto.x); })
					   .attr('data-sex', function(d) { return d.sex; })
					   ;
		new_divs.append('span')
			.text(function(d) { return d.name; } )

		var position_nodes = function(sel) {
			sel
				.style('opacity',1)
				.style('left',function(d) { return px(d.pos.x); })
				.style('top',function(d) { return px(d.pos.y); })
				.style('width',function(d) { return px(d.size.x); })
				.style('height',function(d) { return px(d.size.y); })
				.style('font-size',function(d) { return px(d.size.y/2.5); })
				.attr('data-role',function(d) { return d.class; })
				;
		}

		position_nodes( els.filter('.node.old')
			.transition('reposition').duration(0).delay(old_els.size() > 0 ? 500 : 0) );
		position_nodes( els.filter('.node.new')
			.transition('new_els').duration(0).delay(old_els.size() > 0 ? 1000 : 500) );

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
		var vertices = this.d3.select(this.selector+" .vertices").selectAll(".vertex").data(vdata, function(d) { return d.id; });
		vertices.attr('class','vertex old');
		var new_vxs = vertices.enter();
		var old_vxs = vertices.exit();
		var new_lines = new_vxs.append('path');
		var self = this;

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
			return self.d3.svg.line()
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
					//    .attr('d', function(d) { return lineFunction({start:d.collapseto,end:d.collapseto}); })
					   .attr('d', function(d) { return lineFunction(d); })
					   .attr("stroke-dasharray",  function(d) { return tl(d) + " " + tl(d); })
					   .attr("stroke-dashoffset",  function(d) { return tl(d); })

					//    .attr('x1',function(d) { return d.start.x; })
					   //    .attr('y1',function(d) { return d.start.y; })
					   //    .attr('x2',function(d) { return d.end.x; })
					   //    .attr('y2',function(d) { return d.end.y; });

		old_vxs
			.transition('remove-vertices').duration(500).ease('linear')
			.style('opacity',0)
			.attr("stroke-dashoffset",  function(d) { return tl(d); })
			.remove();

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
	},

	get_contributor_path: function() {
		return false;
	}
};

angular.module('main').controller('FtreeViewController', ['$http', '$window', '$document', '$scope', '$state', '$stateParams', 'apiClient', 'ftreeLayout', FtreeViewController]);
