import {width, height} from './index';  
  
// The largest node for each group: depts, subdepts, brands and products.
// Labeled with their parent's id. 
export const clustersObj = {};

export function createClusteredNode (d) {
  d.x = (width / 2);
  d.y = (height / 2);

  if (!clustersObj[d.parent] || (d.value > clustersObj[d.parent].value)) clustersObj[d.parent] = d;
}