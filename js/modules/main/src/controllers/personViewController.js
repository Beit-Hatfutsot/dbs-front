var PersonViewController = function ($http, $window, $document, $rootScope,
							       $scope, $state, $stateParams, item,
							       recentlyViewed, langManager, ftreeLayout,
								   notification, $location) {
	var self = this, script_loaded = true, node = undefined;
	this.$scope = $scope;
	this.$rootScope = $rootScope;
	this.$state = $state;
	this.$http = $http;
	this.$window = $window;
	this.item = item;
	this.recentlyViewed = recentlyViewed;
	this.langManager = langManager;
	this.notification = notification;
	this.$location = $location;
	this.ftrees_search_params = JSON.parse(this.$window.sessionStorage.getItem('ftrees_search_params'));

	// renderer
	this.rootId = "ftree-layout";
	this.layoutEngine = ftreeLayout;
	this.elements = {};
	this.vertices = {};
	this.tree_number = $stateParams.tree_number;
	this.tree_version = $stateParams.version;
	this.tree = null;

	// TODO: get the size from the dom
	this.layoutEngine.setOptions(new Tuple(1150, 600),  {
        // - individualSize: (w,h)
        individualSize: new Tuple(214,66),
        // - parentSize: (w,h)
        parentSize: new Tuple(152,52),
        // - grandparentSize: (w,h)
        grandparentSize: new Tuple(80,30),
        // - partnerSize: (w,h)
        partnerSize: new Tuple(152,52),
        // - stepparentSize: (w,h)
        stepparentSize: new Tuple(52,52),
        // - childSize: (w,h)
        childSize: new Tuple(94,30),
        grandchildSize: new Tuple(30,30),
        // - inlawsSize: (w,h)
        inlawSize: new Tuple(30,30),
        // - siblingSize: (w,h)
        siblingSize: new Tuple(94,30),
        // - stepsiblingSize: (w,h)
        stepsiblingSize: new Tuple(30,30),
        // - siblingSize: (w,h)
        // - parentMargin: (horizontal,bottom)
        parentMargin: { horizontal:40, vertical:15, bottom:90},
        // - partnerMargin: (horizontal,vertical,left)
        partnerMargin: { horizontal:30, vertical:15, left:50 },
        // - childMargins: (horizontal,vertical,top)
        childMargin: { horizontal:40, vertical:15, top:60 },
        grandchildMargin: { horizontal:2, vertical:28, top:40 },
        // - inlawsMargins: (horizontal,vertical,top)
        inlawMargin: { horizontal:20, vertical:40, top:90 },
        // - siblingMargin: (horizontal,vertical,right)
        siblingMargin: { horizontal:10, vertical:34, right:30, top: -50 },
    });
    self.detailsShown = false;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if (toState.name.endsWith('person-view') && fromState.name.endsWith('person-view')) {
			event.preventDefault();
			notification.loading(false);
			// self.detailsShown = true;
			self.$state.transitionTo(toState.name, toParams, {notify: false});
            if (fromParams.tree_number != toParams.tree_number) {
            	self.clear();
            }
            self.load(toParams);
	    }
	});

	document.documentElement.addEventListener('mouseup', function (e) {
		self.mouseUp(e)
	});

  $rootScope.title = '';
  if (!$window.d3)
    jQuery.getScript('https://d3js.org/d3.v3.min.js', function () {
      // if the node is already loaded, render it
      if ((self.node !== undefined))
        self.render(self.node);
    })
  this.load($stateParams);
};

PersonViewController.prototype = {

	get_full_name: function (d) {
		try {
			return d.name.join(" ");
		}
		catch (e) {
			// something's wrong so we return a smile
			return "\u263a";
		}
	},

	get_fname: function(d) {
		try {
			return d.name[0];
		}
		catch (e) {
			// something's wrong so we return a smile
			return "\u263a";
		}
	},

  clear: function () {
    this.elements = {};
    this.vertices = {};
    this.tree = null;
    this.d3Nodes.remove();
    this.d3Vertices.remove()
    this.d3Circles.remove()
  },

	load: function (params) {
		var self = this,
        slug = 'person_' + params.tree_number + ';' + params.version + '.' + params.node_id;
		self.notification.loading(true);
		self.item.get(slug)
			.then(function (item_data) {
				var name = self.get_full_name(item_data),
					thumbnail_url = null;
				self.node = item_data;
				if (item_data.thumbnail_url)
					thumbnail_url = item_data.thumbnail_url;
				self.recentlyViewed.put({
					params: params,
					state: 'person-view',
					thumbnail: thumbnail_url,
					header: {En: name, He: name}
				});
				self.tree_number = params.tree_number;
				// self.detailsShown = true;
        self.node.Slug = {En: slug};
				self.$rootScope.title = self.get_full_name(self.node);
				//register url changes while walking the tree
				dataLayer.push({
	                event: 'ngRouteChange',
	                attributes: {
	                    route: self.$location.path()
	                }
            	});

				if (self.$window.d3)
					self.render(self.node)
				else
					console.log("waiting for d3 to load")
			}, function (response) {
				console.log('error walking the tree', response)
				console.log(response);
			}).finally(function() {
				self.notification.loading(false);
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
				deceased: node.deceased,
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

	getChildEP:  function(node) {
		if (!node.child_ep)
			return null;
		return {center: node.child_ep,
				id: node.id};
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
		if (((cls == 'sibling') || (cls == 'stepsibling')) && node1.hasOwnProperty('cluster_ep')) {
			ret.end = node1['cluster_ep'];
		}
		else if ((cls=='sibling') || (cls=='grandchild'))
			ret.end = node1['child_ep']
		else
			ret.end = node1[cls+'_ep'];
		if ( !ret.end ) {
			console.log('missing '+cls+'_ep for ',node1);
		}
		ret.collapseto = node1.collapseto;
		// if ( node1.spouse_ofs && ((cls=='sibling') || (cls=='grandchild') || (cls =='child'))) {
		if ( node1.spouse_ofs && ((cls=='grandchild') || (cls =='child'))) {
			ret.ofs = node1.spouse_ofs * -2;
		} else {
			ret.ofs = 0;
		}
		ret.class = cls;
		return ret;
	},

	render: function(node) {
		var cn = node;
		var self = this;
		if ( !cn.pos ) {
			this.layoutEngine.layoutNode(cn);
		}
		var data = [],
		    vdata = [],
			cdata = [],
			siblingsClusters = -1;
		data.push( this.getElement(cn, 'individual') );
		if ( 'parents' in cn ) {
      // create the parents_ids helper array
      var parents_ids = []
      cn.parents.forEach(function (parent, _parent) {
        parents_ids[_parent] = parent.id;
      });
			cn.parents.forEach(function (parent, _parent) {
				data.push( self.getElement(parent,'parent') );
				if ( _parent == 0 ) {
					cdata.push( self.getChildEP(parent) );
					vdata.push( self.getVertex(parent,cn,'child') );
					if (parent.hasOwnProperty("cluster_ep")) {
						var line = new Object({
							class: "line",
							start: parent.child_ep,
							end: parent.cluster_ep,
							ofs: 0,
							id: parent.id+parent.name+':cluster_up'
						});
						vdata.push(line);
					}
				} else {
					vdata.push( self.getVertex(cn.parents[0],parent,'spouse') );
				}
				if ( parent.parents ) {
					parent.parents.forEach( function (grandparent, _grandparent) {
						data.push( self.getElement(grandparent,'grandparent') );
						if ( _grandparent == 0 ) {
							cdata.push( self.getChildEP(grandparent) );
							vdata.push( self.getVertex(grandparent,parent,'child') );
						} else {
							vdata.push( self.getVertex(parent.parents[0],grandparent,'spouse') );
						}
					});
				}
				if ( parent.partners ) {
					parent.partners.forEach( function (stepparent) {
						// make sure it's really a stepparent == not one of the parents
						if (parents_ids.indexOf(stepparent.id) == -1) {
							data.push( self.getElement(stepparent,'stepparent') );
							vdata.push( self.getVertex(stepparent, parent, 'spouse') );
						}
						if (stepparent.children.length > 0) {
							cdata.push( self.getChildEP(stepparent) );
							if (stepparent.hasOwnProperty('cluster_ep')) {
								var line = new Object({
									class: "line",
									start: stepparent.child_ep,
									end: stepparent.cluster_ep,
									ofs: siblingsClusters*5,
									id: stepparent.id+stepparent.name+':cluster_up'
								});
								vdata.push(line);
								siblingsClusters--;
							};
						}
						stepparent.children.forEach( function (stepsibling) {
							data.push( self.getElement(stepsibling,'stepsibling') );
							vdata.push( self.getVertex(stepparent, stepsibling, 'stepsibling') );
						});
					});
				}
			})
		};
		if ( 'partners' in cn ) {
			cn.partners.forEach(function (partner) {
				data.push( self.getElement(partner,'partner') );
				vdata.push( self.getVertex(partner,cn,'spouse') );
				cdata.push( self.getChildEP(partner) );
				partner.children.forEach(function (child) {
					data.push( self.getElement(child,'child') );
					vdata.push( self.getVertex(partner, child,'child') );
					child.partners.forEach(function (inlaw) {
						data.push( self.getElement(inlaw,'inlaw') );
						vdata.push( self.getVertex(inlaw, child, 'spouse') );
						if (inlaw.children.length > 0)
							cdata.push( self.getChildEP(inlaw) );
						inlaw.children.forEach(function (grandchild) {
							data.push( self.getElement(grandchild,'grandchild') );
							vdata.push( self.getVertex(inlaw, grandchild, 'grandchild') );
						})
					})
				});
			})
		};
		if ( 'siblings' in cn ) {
			var parent = cn.parents[0];
			cn.siblings.forEach(function  (sibling, _sibling) {
				data.push( self.getElement(sibling, 'sibling') );
				vdata.push( self.getVertex(parent, sibling, 'sibling') );
			})
		}

		function px(value) { return value + 'px'; };
		function get_sex(d) {
			return (d.sex !== undefined) ? d.sex : 'U';
		};
		var avatars = {'M': 'images/man.png',
					   'F': '/images/woman.png',
					   'U': '/images/unknown.png'};
		this.vertical_pos = (self.langManager.lang == 'he')?'right':'left';
		this.vertical_transform = (self.langManager.lang == 'he')?
			'translate(1150,0) scale(-1,1)':'translate(0,0)';

		// NODES
		var els = d3.select('#' + this.rootId+" .nodes").selectAll(".node").data(data, function(d) { return d.id; });
		els.classed('old',true).classed('new', false);
		var new_els = els.enter();
		var old_els = els.exit();
		//var scope = this.$scope.$new(true);
		var new_divs = new_els.append('div');
		new_divs.classed('node', true)
			.classed('new', true)
			.classed('clickable', function (d) { return d.id !== undefined; })
			.on("click", function (d) {
				if (d.class == 'individual') {
					self.detailsShown = !self.detailsShown;
					self.$scope.$apply();
				}
				else if (d.id) {
					self.$state.go((self.langManager.lang == 'he')?
								    'he.he_person-view':'person-view',
							   {tree_number: self.tree_number, version: self.tree_version||0, node_id: d.id});
				}
			})
			.attr('role',function(d) { return d.hasOwnProperty('class') ? d.class : 'unknown'; })
			.attr('sex', get_sex)
			.attr('title', function (d) { return self.get_full_name(d); })
			.style('top', px(cn.pos.y))
			.style(self.vertical_pos, px(cn.pos.x))
			.style('width',function(d) { return px(d.size.x); })
			.style('height',function(d) { return px(d.size.y); });

		new_divs.append('div')
				.classed('avatar', true)
				.append('img')
				.attr('src', function (d) {
					var sex = get_sex(d);
					return avatars[sex];
				});

		new_divs.append('div')
			    .classed('name', true)
				  .classed('noselect', true)
				  .text(function(d) {
					return ['individual', 'partner', 'parent']
						   .indexOf(d.class) >= 0 ? self.get_full_name(d):
													self.get_fname(d)
					});


		var position_nodes = function(sel) {
			sel.style('opacity',1)
				.style('top',function(d) { return px(d.pos.y); })
				.style(self.vertical_pos,function(d) { return px(d.pos.x); })
				.style('width',function(d) { return px(d.size.x); })
				.style('height',function(d) { return px(d.size.y); })
				.style('font-size',function(d) {
					return d.class == 'individual'? "20px": px(d.size.y/2.5); });
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
			.style(self.vertical_pos,function(d) { return px(d.collapseto.x); })
			.style('opacity',0)
			.transition('exit').duration(500)
			.remove()
			;


		els.selectAll("span")
			.style('width',function(d) { return px(d.size.x); })
			.style('height',function(d) { return px(d.size.y); })

		// add the dates for the middle individual
		var indi = els.filter(function(d) { return d.id == cn.id });
		indi.select('.dates').remove();
		indi.insert('div', '.name')
				.classed('dates', true)
				.classed('noselect', true)
				.html(function(d) {
				 	var birth = cn.birth_year ? cn.birth_year : '';
				 	var death =  cn.death_year ? cn.death_year : '';
				 	return birth + ' ' + death
				});

		// CIRCLES
		var circles = d3.select('.vertices').selectAll(".child-ep")
					    .data(cdata, function(d) { return d.id; }),
		    new_cs = circles.enter(),
		    old_cs = circles.exit(),
		    new_circles = new_cs.append('circle');
		circles.attr("transform", self.vertical_transform);
		old_cs.remove();
		new_circles.classed('new', true)
				   .classed('child-ep', true)
				   .attr('cy', function(d) { return d.center.y  })
				   .attr('cx', function(d) { return d.center.x  })
				   .attr('r', "4")
				   .attr('fill','none')
		           .transition('new_circles').duration(0).delay(1500)
				    .attr('fill','#aaaaaa');
		// VERTICES
		var vertices = d3.select('.vertices').selectAll(".vertex").data(vdata, function(d) { return d.id; }),
		    new_vxs = vertices.enter(),
		    old_vxs = vertices.exit(),
		    new_lines = new_vxs.append('path');
		vertices.attr('class','vertex old');


		var lineFunction = function(p) {
			var midpoint = (p.start.y + p.end.y) / 2,
			    points,
				interpolate;
			self.layoutEngine.midpoints.every(function (m, _m)  {
				if ( m > p.start.y && m < p.end.y || m < p.start.y && m > p.end.y) {
					midpoint = m;
					return false;
				}
				return true;
			});
			midpoint += p.ofs;
			if ((p.class=="stepsibling") || (p.class=="sibling")) {
				interpolate = "basis";
				points =[ [p.start.x, p.start.y], [p.end.x, p.start.y-8], [p.end.x, p.end.y]]
			}
			else if (p.class=="grandchild") {
				interpolate = "basis";
				points =[ [p.start.x, p.start.y], [p.end.x, p.start.y-8], [p.end.x,midpoint], [p.end.x, p.end.y]]
			}
			else {
				interpolate = "line";
				points =[ [p.start.x, p.start.y], [p.start.x, midpoint], [p.end.x,midpoint], [p.end.x, p.end.y]];
			}

			return d3.svg.line()
                 		.x(function(d) { return d[0]; })
                 		.y(function(d) { return d[1]; })
                 		.interpolate(interpolate)
						(points);
		}
		var tl = function(d) { // total length of a path
			if ( isNaN(Math.abs(d.start.x-d.end.x) + Math.abs(d.start.y-d.end.y)) ) {
				console.log('XXX',d);
			}
			return Math.abs(d.start.x-d.end.x) + Math.abs(d.start.y-d.end.y);
		}

		new_lines.attr('class','vertex new')
					   .style('opacity',0)
					   .style('stroke','#aaaaaa')
					   .style('stroke-width',2)
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
		vertices.attr("transform", self.vertical_transform);
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
		// caching the nodes & vertices for panning
		this.d3Nodes = d3.select('#' + this.rootId + " .nodes")
			.selectAll(".node")
			.data(data, function(d) { return d.id; })
		this.d3Vertices = d3.select('.vertices')
			.selectAll(".vertex")
			.data(vdata, function(d) { return d.id; })
		this.d3Circles = d3.select('.vertices')
			.selectAll(".child-ep")
			.data(cdata, function(d) { return d.id; })

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
				.css("cursor", "grabbing")
		}
	},
	mouseUp: function (e) {
		if (e.which == 1) {
			this.mousePressed = false;
			angular.element(document.getElementById(this.rootId))
				.css("cursor", "grab")
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
		transform = "translate("+this.pannedX+','+this.pannedY+")"+this.vertical_transform;

		this.lastMouseX = e.clientX;
		this.lastMouseY = e.clientY;

		function px(value) { return value + 'px'; };

		this.d3Nodes
			.transition('pan').duration(0)
			.style(self.vertical_pos, function (d) {
				if (self.vertical_pos == 'left')
					d.pos.x += x;
				else
					d.pos.x -= x;
				return px(d.pos.x);
			})
			.style('top', function (d) {
				d.pos.y += y;
				return px(d.pos.y);
			});
		this.d3Vertices
			.transition('pan').duration(0)
			.attr('transform',  transform);
		this.d3Circles
			.transition('pan').duration(0)
			.attr('transform',  transform);
			/*
			.attr('cx',  function (d) {
				if (self.vertical_pos == 'left')
                    d.center.x += x;
                else
                    d.center.x -= x;
				return d.center.x;
			})
			.attr('cy',  function (d) {
				 d.center.y += y;
				 return d.center.y;
			});
			*/
		d3.timer.flush();
		this.lastPan = Date.now()
	}
};

angular.module('main').controller('PersonViewController',
			  ['$http', '$window', '$document', '$rootScope', '$scope',
			   '$state', '$stateParams', 'item', 'recentlyViewed',
			   'langManager', 'ftreeLayout', 'notification', '$location',
			   PersonViewController]);
