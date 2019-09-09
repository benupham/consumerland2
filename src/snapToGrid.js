/* 

1. All nodes are assigned a pre-existing grid location
2. When new nodes enter, they are assigned the closest grid location that does not have a node
from the entering group.
3. When a node is displaced by an entering node, it is added to the end of the entering node group
to be repositioned 
4. This means all nodes are repositioned (rippled) with each action. 

Use this: https://observablehq.com/@kikinna/uaah-force-directed-layout-in-a-grid

*/

export const GRID_UNIT_SIZE = 160;
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 100;

export let grid = {
  cells : [],
  
  init : function() {
    this.cells = [];
    for(var i = 0; i < GRID_WIDTH; i++) {
      for(var j = 0; j < GRID_HEIGHT; j++) {
        var cell;
        cell = {
          x : i * GRID_UNIT_SIZE,
          y : j * GRID_UNIT_SIZE,
          occupied : false
        };
        this.cells.push(cell);
      };
    };
  },
    
  sqdist : function(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  },

  occupyNearest : function(p) {
    var minDist = 100000000;
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

//grid.init();