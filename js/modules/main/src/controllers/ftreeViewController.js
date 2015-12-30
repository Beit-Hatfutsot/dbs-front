var FtreeViewController = function ($http, $window, $document, $scope, $state,
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

	// TODO: get the size from the dom
	this.layoutEngine.setOptions(new Tuple(800, 500),  {
        // - individualSize: (w,h)
        individualSize: new Tuple(214,66),
        // - parentSize: (w,h)
        parentSize: new Tuple(152,52),
        // - partnerSize: (w,h)
        partnerSize: new Tuple(152,52),
        // - childSize: (w,h)
        childSize: new Tuple(94,25),
        // - siblingSize: (w,h)
        siblingSize: new Tuple(94,25),
        // - parentMargin: (horizontal,bottom)
        parentMargin: { horizontal:20, vertical:15, bottom:90},
        // - partnerMargin: (horizontal,vertical,left)
        partnerMargin: { horizontal:30, vertical:15, left:50 },
        // - childMargins: (horizontal,vertical,top)
        childMargin: { horizontal:40, vertical:15, top:60 },
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

	 // TODO: get the fwalk from the apiClient
	var params = {i: $stateParams.i};
	if ('t' in $stateParams)
		params.t = $stateParams.t;
	this.load(params);
};

FtreeViewController.prototype = {

	get_fname: function(full_name) {
		if (!full_name)
			return "?";
		var parts = full_name.split(' ');
		return parts[0];
		/*var fname = parts[0];
		var lname = parts[1];*/
	},

	load: function (params) {
		var self = this;

		/* this.$http.get(this.apiClient.base_url+"/fwalk", {
			params: params,
			cache: true 
	  		})
			.success(function (response) {
			 	console.log(response);
				if (self.d3 != null)
					self.render(response)
				else 
					console.log("where's d3?")
			})
			.error(function (response) {
				console.log('error walking the tree');
				console.log(response); 
			}); */

	self.render(
{
  "fams": "@F3277@", 
  "sex": "M", 
  "rin": "MH:I7869", 
  "name_surn": "Einstein", 
  "_uid": "DE33792F-03CB-4680-9023-94A5B5C1346D", 
  "famc": "@F2549@", 
  "children": [
    {
      "partners": [], 
      "name": "Karoline Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2315874", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2326048"
    }, 
    {
      "partners": [], 
      "name": "Dozle Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2315874", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2317847"
    }, 
    {
      "partners": [], 
      "name": "Rosalie Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2328698", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2329079"
    }, 
    {
      "partners": [], 
      "name": "Hannele Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2328698", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2337184"
    }, 
    {
      "partners": [], 
      "name": "Pauline Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2328698", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2334757"
    }, 
    {
      "partners": [], 
      "name": "Mandus Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2328698", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "M", 
      "id": "2320920"
    }, 
    {
      "partners": [], 
      "name": "Babette Einstein", 
      "children": [], 
      "parents": [
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2328698", 
          "name": "Juettle Lindauer"
        }
      ], 
      "sex": "F", 
      "id": "2330331"
    }
  ], 
  "partners": [
    {
      "id": "2328698", 
      "name": "Juettle Lindauer", 
      "sex": "F"
    }, 
    {
      "id": "2315874", 
      "name": "Juettle Lindauer", 
      "sex": "F"
    }
  ], 
  "birt__uid": "426722A4-C749-4405-8EAD-3C8159E6E1A7", 
  "id": "2316813", 
  "birt_plac": "Jebenhausen, Germany", 
  "parents": [
    {
      "id": "2332769", 
      "children": [
        {
          "sex": "F", 
          "id": "2315501", 
          "name": "Theresa Dolzele Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2324918", 
          "name": "Baruch Immanuel Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2319850", 
          "name": "Lamle Lewis Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2332425", 
          "name": "Rebekka Einstein"
        }
      ], 
      "parents": [
        {
          "sex": "M", 
          "id": "2324356", 
          "name": "Joseph Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2321846", 
          "name": "Rebekka"
        }
      ], 
      "name": "Immanuel Einstein", 
      "sex": "M"
    }, 
    {
      "id": "2334703", 
      "children": [
        {
          "sex": "F", 
          "id": "2315501", 
          "name": "Theresa Dolzele Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2316813", 
          "name": "Hajim Henri Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2324918", 
          "name": "Baruch Immanuel Einstein"
        }, 
        {
          "sex": "M", 
          "id": "2319850", 
          "name": "Lamle Lewis Einstein"
        }, 
        {
          "sex": "F", 
          "id": "2332425", 
          "name": "Rebekka Einstein"
        }
      ], 
      "parents": [], 
      "name": "Fanni Fredle Hajim", 
      "sex": "F"
    }
  ], 
  "tree_id": "641C1040-12D3-48DA-ABFA-5E723EE6C011", 
  "siblings": [
    {
      "id": "2315501", 
      "parents": [
        {
          "sex": "M", 
          "parents": [
            {
              "sex": "M", 
              "id": "2324356", 
              "name": "Joseph Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2321846", 
              "name": "Rebekka"
            }
          ], 
          "id": "2332769", 
          "name": "Immanuel Einstein", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }, 
        {
          "sex": "F", 
          "parents": [], 
          "id": "2334703", 
          "name": "Fanni Fredle Hajim", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }
      ], 
      "name": "Theresa Dolzele Einstein", 
      "sex": "F"
    }, 
    {
      "id": "2324918", 
      "parents": [
        {
          "sex": "M", 
          "parents": [
            {
              "sex": "M", 
              "id": "2324356", 
              "name": "Joseph Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2321846", 
              "name": "Rebekka"
            }
          ], 
          "id": "2332769", 
          "name": "Immanuel Einstein", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }, 
        {
          "sex": "F", 
          "parents": [], 
          "id": "2334703", 
          "name": "Fanni Fredle Hajim", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }
      ], 
      "name": "Baruch Immanuel Einstein", 
      "sex": "M"
    }, 
    {
      "id": "2319850", 
      "parents": [
        {
          "sex": "M", 
          "parents": [
            {
              "sex": "M", 
              "id": "2324356", 
              "name": "Joseph Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2321846", 
              "name": "Rebekka"
            }
          ], 
          "id": "2332769", 
          "name": "Immanuel Einstein", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }, 
        {
          "sex": "F", 
          "parents": [], 
          "id": "2334703", 
          "name": "Fanni Fredle Hajim", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }
      ], 
      "name": "Lamle Lewis Einstein", 
      "sex": "M"
    }, 
    {
      "id": "2332425", 
      "parents": [
        {
          "sex": "M", 
          "parents": [
            {
              "sex": "M", 
              "id": "2324356", 
              "name": "Joseph Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2321846", 
              "name": "Rebekka"
            }
          ], 
          "id": "2332769", 
          "name": "Immanuel Einstein", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }, 
        {
          "sex": "F", 
          "parents": [], 
          "id": "2334703", 
          "name": "Fanni Fredle Hajim", 
          "children": [
            {
              "sex": "F", 
              "id": "2315501", 
              "name": "Theresa Dolzele Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2316813", 
              "name": "Hajim Henri Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2324918", 
              "name": "Baruch Immanuel Einstein"
            }, 
            {
              "sex": "M", 
              "id": "2319850", 
              "name": "Lamle Lewis Einstein"
            }, 
            {
              "sex": "F", 
              "id": "2332425", 
              "name": "Rebekka Einstein"
            }
          ]
        }
      ], 
      "name": "Rebekka Einstein", 
      "sex": "F"
    }
  ], 
  "birth_year": 1806, 
  "name__aka": "Henri", 
  "name": "Hajim Henri /Einstein/", 
  "birt_date": "1806", 
  "name_givn": "Hajim Henri", 
  "order": {
    "marriage_year": 1806, 
    "birth_year": 1806
  }, 
  "birt_rin": "MH:IF13109"
}

);

	},

	getElement: function (node,cls) {
		var ret;
		//console.log(node);
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
			ret.start = node2.pos.plus(node2.size.mult(0.5));
    } else {
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
				data.push( self.getElement(sibling,'sibling') );
			})
		}

		function px(value) { return value + 'px'; };

		// Adding nodes
		var els = this.d3.select(this.selector+" .nodes").selectAll(".node").data(data, function(d) { return d.id; });
		els.classed('old',true).classed('new', false);
		var new_els = els.enter();
		var old_els = els.exit();
		//var scope = this.$scope.$new(true);
		var new_divs = new_els.append('div');
		new_divs.classed('node', true)
			.classed('new', true)
			.on("click", function (d) { self.load({i: d.id}); })
			.attr('role',function(d) { return d.hasOwnProperty('class') ? d.class : 'unknown'; })
			.attr('sex', function (d) { return d.hasOwnProperty('sex') ? d.sex : 'U';})

		
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
            return ['individual', 'partner', 'parent'].indexOf(d.class) >= 0 ? d.name: self.get_fname(d.name)
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
		var vertices = this.d3.select(this.selector+" .vertices").selectAll(".vertex").data(vdata, function(d) { return d.id; });
		vertices.attr('class','vertex old');
		var new_vxs = vertices.enter();
		var old_vxs = vertices.exit();
		var new_lines = new_vxs.append('path');
		var self = this;

		var lineFunction = function(p) {
			var midpoint = (p.start.y + p.end.y) / 2;
			self.layoutEngine.midpoints.every(function (m, _m)  {
				var m = self.layoutEngine.midpoints[_m];
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
