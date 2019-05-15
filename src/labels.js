
import * as d3 from 'd3';

import { nodes } from "./index"
import { labelsArray } from "./click"


// displays dept/subdept names in mathematical center of points
// TODO: use d3 to enter/exit labels 

var label = d3.select("svg").selectAll('g.label');

export function positionLabels() {
  labelsArray.forEach(l => {
    const children = nodes.filter(c => c.parent === l.id); 
    const center = getCenterOfChildren(children);
    l.x = center.x;
    l.y = center.y;
  })
  displayLabels(labelsArray);
}
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

function displayLabels(labelsArray) {
  
  label = label.data(labelsArray, function(d) { return d.id;})

  label.enter().append("g")
  .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
  .attr("class", "label")
  .append("text")
  .attr("class", d => d.type)
  .text(name)
    
  label.exit()
  .remove();
}

