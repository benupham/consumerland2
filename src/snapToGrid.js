let grid = {
  cells : [],
  
  init : function() {
    this.cells = [];
    for(var i = 0; i < width / GRID_SIZE; i++) {
      for(var j = 0; j < height / GRID_SIZE; j++) {
        // HACK: ^should be a better way to determine number of rows and cols
        var cell;
        cell = {
          x : i * GRID_SIZE,
          y : j * GRID_SIZE,
          occupied : false
        };
        this.cells.push(cell);
      };
    };
    // console.log("Grid initialized. Hopefully.")
  },
    
  sqdist : function(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  },

  occupyNearest : function(p) {
    var minDist = 1000000;
    var d;
    var candidate = null;
    for(var i = 0; i < this.cells.length; i++) {
      if(!this.cells[i].occupied && ( d = this.sqdist(p, this.cells[i])) < minDist) {
        minDist = d;
        candidate = this.cells[i];
      }
    }
    if(candidate)
      candidate.occupied = true;
    return candidate;
  }
}

grid.init();
console.log(grid.cells);


simulation.on("tick", () => {
  grid.init();
  
  node
      .each(function(d) { 
        let gridpoint = grid.occupyNearest(d);
        if (gridpoint) {            
            // ensures smooth movement towards final positoin
            d.x += (gridpoint.x - d.x) * .05;
            d.y += (gridpoint.y - d.y) * .05;
          
            // jumps directly into final position  
            // d.x = gridpoint.x;
            // d.y = gridpoint.y
          }
       })
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
});

gridDistance = 300;
const width = 7000;
const height = 7000;

function findNearestGridPoint(d) {
  // find 4 corners of the square around point
  const ceilX = Math.ceil(d.x / gridDistance) * gridDistance;
  const floorX = Math.floor(d.x / gridDistance) * gridDistance;
  const ceilY = Math.ceil(d.y / gridDistance) * gridDistance;
  const floorY = Math.floor(d.y / gridDistance) * gridDistance; 
  const square = [[floorX,floorY],[floorX,ceilY],[ceilX,ceilY],[ceilX,floorY]]
}

/**
 * Pulls nodes toward a specified `(x, y)` target point.
 * Modify this to pull towards nearest grid point.
 * Accelerate force as alpha approaches zero
 * Use quadtree to store all possible grid values? Or calculate each time?
 */
var forceAttract = function (target) {

  var nodes = void 0,
      targets = void 0,
      strength = void 0,
      strengths = void 0;

  function force(alpha) {
    var node = void 0,
        target = void 0,
        strength = void 0;
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      target = targets[i];
      strength = strengths[i];
      node.vx += (target[0] - node.x) * strength * alpha;
      node.vy += (target[1] - node.y) * strength * alpha;
    }
  }

  function initialize() {
    if (!nodes) return;

    // populate local `strengths` using `strength` accessor
    strengths = new Array(nodes.length);
    for (var i = 0; i < nodes.length; i++) {
      strengths[i] = strength(nodes[i], i, nodes);
    } // populate local `targets` using `target` accessor
    targets = new Array(nodes.length);
    for (var _i = 0; _i < nodes.length; _i++) {
      targets[_i] = target(nodes[_i], _i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    // return existing value if no value passed
    if (_ == null) return strength;

    // coerce `strength` accessor into a function
    strength = typeof _ === 'function' ? _ : function () {
      return +_;
    };

    // reinitialize
    initialize();

    // allow chaining
    return force;
  };

  force.target = function (_) {
    // return existing value if no value passed
    if (_ == null) return target;

    // coerce `target` accessor into a function
    target = typeof _ === 'function' ? _ : function () {
      return _;
    };

    // reinitialize
    initialize();

    // allow chaining
    return force;
  };

  if (!strength) force.strength(0.1);
  if (!target) force.target([0, 0]);

  return force;
};
