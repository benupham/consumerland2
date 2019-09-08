import * as d3 from 'd3';

import {depts,subdepts,brands,products, nodes, update, svg} from './index';
import {clustersObj} from './clustering';

export const labelsArray = [];

export function click(d) {
  let newNodes = []; 
  if (d.type == 'dept') {
    newNodes = subdepts.filter(sd => sd.parent == d.id)
  } else if (d.type == 'subdept') {
    newNodes = brands.filter(b => b.parent == d.id)
  } else if (d.type == 'brand') {
    newNodes = products.filter(p => p.parent == d.id)
  } else {
    return
  }

  d.children = newNodes;
  labelsArray.push(d);

  console.log('clicked node',d)

  // Remove the clicked parent node
  for( var i = 0; i < nodes.length; i++){ 
    if ( nodes[i].id === d.id) {
      nodes.splice(i, 1);
    }
  }

  // If the clicked node was the biggest in its cluster, find 2nd biggest
  if (clustersObj[d.parent] === d) {
    clustersObj[d.parent] = null; 
    nodes.forEach(n => {      
      if (n.parent === d.parent && (!clustersObj[d.parent] || n.value > clustersObj[d.parent].value)) 
      {
        clustersObj[d.parent] = n;
      }
    })
  }
  
  // Set location of entering nodes around position of parent node
  // Set a timer, then update for each
  newNodes.forEach((n,i) => {
    d3.timeout(function() {
      if (i === 0) {
        n.x = d.x;
        n.y = d.y;
      } else {
        n.x = d.x 
        n.y = d.y   
      }
      nodes.unshift(n);   
      update()
    }, 2 * i)
  });

}

// list different functions for different types
// of responses to clicking on a parent element
function expandAndFill() {

}

function repelNeighbors() {

}


