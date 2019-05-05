import * as d3 from 'd3';

import {depts,subdepts,brands,products, nodes, update} from './index';
import {clustersObj} from './clustering';

export function click(d) {
  let newNodes = []; 
  if (d.type == 'dept') {
    newNodes = subdepts.filter(sd => sd.parent == d.id)
  } else if (d.type == 'subdept') {
    newNodes = brands.filter(b => b.parent == d.id)
  } else if (d.type == 'brand') {
    newNodes = products.filter(p => p.parent == d.id)
  }
  console.log(d)

  // Remove the clicked parent node
  for( var i = 0; i < nodes.length; i++){ 
    if ( nodes[i].id === d.id) {
      const removedNode = nodes.splice(i, 1)[0];
      console.log(removedNode)
      // If the clicked node was the biggest in its cluster, find 2nd biggest
      if (clustersObj[removedNode.parent] === removedNode) {
        clustersObj[removedNode.parent] = null; 
        nodes.forEach(n => {
          
          if (n.parent === removedNode.parent && (!clustersObj[removedNode.parent] || n.value > clustersObj[removedNode.parent].value)) 
          {
            clustersObj[removedNode.parent] = n;
          }
        })
      }
    }
  }
  
  // Set location of entering nodes around position of parent node
  // Set a timer, then update for each
  newNodes.forEach((n,i) => {
    d3.timeout(function() {
      n.x = d.x + Math.random() * 10;
      n.y = d.y + Math.random() * 10;
      nodes.push(n);   
      update()
    }, 75 * i)
  });
}