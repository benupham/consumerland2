
/**
 * Pulls nodes toward nearest grid point.
 * 
 */
export const forceGrid = function (grid) {

  var nodes = void 0,
      strength = void 0,
      grids = void 0,
      strengths = void 0;

  function force(alpha) {
    var node = void 0,
        target = void 0,
        strength = void 0;
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      target = calcGridPoint(node);
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
    } // populate local `grid` size using `grid` accessor
    grids = new Array(nodes.length);
    for (var _i = 0; _i < nodes.length; _i++) {
      grids[_i] = grid(nodes[_i], _i, nodes);
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

  force.grid = function (_) {
    // return existing value if no value passed
    if (_ == null) return grid;

    // coerce `grid` accessor into a function
    grid = typeof _ === 'function' ? _ : function () {
      return _;
    }

    // reinitialize
    initialize();

    // allow chaining
    return force;
  };

  function calcGridPoint(node) {
    const width = grid(node)[0];
    const height = grid(node)[1];
    const targetX = Math.round(node.x / width) * width;
    const targetY = Math.round(node.y / height) * height;
    return [targetX,targetY]
  }

  if (!strength) force.strength(0.5);
  if (!grid) force.grid([100,100]);

  return force;
};
