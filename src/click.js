import * as d3 from 'd3';

import {depts,subdepts,brands,products, nodes, update, svg} from './index';
import {clustersObj} from './clustering';

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
      n.x = d.x + Math.random() * 10;
      n.y = d.y + Math.random() * 10;
      nodes.push(n);   
      update()
    }, 75 * i)
  });

  const parentLabel = getCenterOfChildren(newNodes);
  displayParentName(d.name, parentLabel);
}

// list different functions for different types
// of responses to clicking on a parent element
function expandAndFill() {

}

function repelNeighbors() {

}

// zooming out to a certain point hides product/brand names
// displays dept/subdept names in mathematical center of points
function getCenterOfChildren(children) {
  const center = {};
  let x = 0;
  let y = 0;
  children.forEach(d => {
    x = x + d.x;
    y = y + d.y;
  });
  center.x = x / children.length;
  center.y = y / children.length;
  return center
}

function displayParentName(name, location) {
  svg.append("g")
  .attr("transform", function (d) { return "translate(" + location.x + "," + location.y + ")"; })
  .attr("class", "area-label")
  .append("text")
  .text(name)
}