import * as d3 from 'd3';
import {nodes, clusterPadding, padding} from './index';
import { paddings } from './constants';
import { jiggle } from './utilities';

export function forceCollideCustom() {
  const alpha = 0.4; // fixed for greater rigidity!
  const padding1 = 30; // separation between same-parent nodes
  const padding2 = 200; // separation between different-parent nodes
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      const r = d.radius + maxRadius;
      const nx1 = d.x - r, ny1 = d.y - r;
      const nx2 = d.x + r, ny2 = d.y + r;
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length) do {
          if (q.data !== d) {
            const r = d.radius + q.data.radius + calculateCollisionPadding(d, q.data); //(d.parent === q.data.parent ? 100 : 300)
            // if (d.id % 10 === 0) console.log(calculateCollisionPadding(d, q.data));
            let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
            if (l < r) {
              // if (x === 0) x = jiggle();
              // if (y === 0) y = jiggle();
              l = (l - r) / l * alpha;
              d.x -= x *= l, d.y -= y *= l;
              q.data.x += x, q.data.y += y;
            }
          }
        } while (q = q.next);
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  }

  force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

  return force;
}


export function calculateCollisionPadding(d, q) {
  let padding = paddings.sameGGrandParent;

  if (d.parent === q.parent) {
    // console.log('parents match')
    padding = paddings.sameParent
  } else if (d.brand && d.brand === q.brand) {
    // console.log('brands match')
    padding = paddings.sameParent
  } else if (d.subdept && d.subdept === q.subdept) {
    // console.log('subdept match')
    padding = paddings.sameGrandParent
  } else if (d.dept && d.dept === q.dept) {
    // console.log('dept match')
    padding = paddings.sameGGrandParent
  } 

  return padding
}

