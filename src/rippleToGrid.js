/* 

1. All nodes are assigned a pre-existing grid location
2. When new nodes enter, they are assigned the closest grid location that does not have a node
from the entering group.
3. When a node is displaced by an entering node, it is added to the end of the entering node group
to be repositioned 
4. This means all nodes are repositioned (rippled) with each action. 

Use this: https://observablehq.com/@kikinna/uaah-force-directed-layout-in-a-grid

*/