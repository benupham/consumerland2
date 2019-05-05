import * as d3 from 'd3';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

import {width, height, nodes} from './index';
import {clustersObj} from './clustering';

export const simulation = d3.forceSimulation(nodes)
// keep entire simulation balanced around screen center
.force('center', d3.forceCenter(width/2, height/2))

// pull toward center
.force('attract', d3.forceAttract()
  .target([width/2, height/2])
  .strength(0.01))

// cluster by section
.force('cluster', d3.forceCluster()
  .centers(function (d) { return clustersObj[d.parent]; })
  .strength(0.5)
  .centerInertia(0.1))

// apply collision with padding
.force('collide', d3.forceCollide(function (d) { return d.radius + padding; })
  .iterations(2)
  .strength(0))

.on('tick', layoutTick);   

function layoutTick (e) {
  node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// ramp up collision strength to provide smooth transition
var transitionTime = 3000;
var t = d3.timer(function (elapsed) {
  var dt = elapsed / transitionTime;
  simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
  if (dt >= 1.0) t.stop();
});
