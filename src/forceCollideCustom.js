import * as d3 from 'd3';
import {nodes, clusterPadding, padding} from './index';

export function forceCollide(alpha) {
  // const alpha = 0.4; // fixed for greater rigidity!
  const padding1 = 2; // separation between same-color nodes
  const padding2 = 6; // separation between different-color nodes
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      const r = d.r + maxRadius;
      const nx1 = d.x - r, ny1 = d.y - r;
      const nx2 = d.x + r, ny2 = d.y + r;
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length) do {
          if (q.data !== d) {
            const r = d.r + q.data.r + (d.parent === q.data.parent ? padding1 : padding2);
            let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
            if (l < r) {
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

// //https://bl.ocks.org/shancarter/f621ac5d93498aa1223d8d20e5d3a0f4
// export function collide(alpha) {
//   console.log('nodes',nodes)
//   var quadtree = d3.quadtree(nodes)
//       // .x((d) => d.x)
//       // .y((d) => d.y)
//       // .addAll(nodes);

//   nodes.forEach(function(d) {
//     var r = d.radius + Math.max(padding, clusterPadding),
//         nx1 = d.x - r,
//         nx2 = d.x + r,
//         ny1 = d.y - r,
//         ny2 = d.y + r;
//     quadtree.visit(function(quad, x1, y1, x2, y2) {
//       console.log('visit variables',quad, x1, y1, x2, y2)
//       if (quad.data && (quad.data !== d)) {
//         var x = d.x - quad.data.x,
//             y = d.y - quad.data.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + quad.data.radius + (d.parent === quad.data.parent ? padding : clusterPadding);
//             console.log(quad.data.radius)
//             console.log(d.parent, quad.data.parent)
//             console.log(r)
//         if (l < r) {
//           l = (l - r) / l * alpha;
//           d.x -= x *= l;
//           d.y -= y *= l;
//           quad.data.x += x;
//           quad.data.y += y;
//         }
//       }
//       return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//     });
//   });
// }

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
            const r = d.radius + q.data.radius + (d.parent === q.data.parent ? padding1 : padding2);
            let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
            if (l < r) {
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