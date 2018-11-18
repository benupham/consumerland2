import * as d3 from 'd3';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';

const width = 960;
const height = 500;
const maxRadius = 12;
const padding = .5; // separation between same-color nodes
const clusterPadding = 6; // separation between different-color nodes

var n = 200, // total number of circles
    m = 10; // number of distinct clusters

var color = d3.scaleOrdinal(d3.schemeCategory20)
    .domain(d3.range(20));


d3.json("./data/testd3dataNoSalesDept.json", function(error, root) {

  // create the circle pack algorithm
  var pack = d3.pack()
    .size([(width), (height)])
    .padding(0);  

  // create the hierarchy for pack  
  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
      
  // circle pack the data    
  var thePack = pack(root);  

  var depts = [];
  var subdepts = [];

  // extract the circle-packed subdepartment nodes
  thePack.children.forEach(d => {
    depts.push(d);
    d.children.forEach(sd => {
      subdepts.push(sd);
    });
  });
  
  var clustersObj = {};

  // create the nodes, and assign the "largest" for each dept to clustersObj
  var nodes = subdepts.map(function(sd) {
    const id = sd.data.id;
    const i = sd.parent.data.name;
    const r = 12;
    const d = {cluster: i, radius: r, x: sd.x, y: sd.y, id: id};

    // this is only really relevant if r is not the same for every node
    if (!clustersObj[i] || (r > clustersObj[i].radius)) clustersObj[i] = d;
    return d;
  });
  console.log('nodes',nodes)

  var simulation = d3.forceSimulation()
    // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(width/2, height/2))
    
    // pull toward center; from 3rd party attract library
    .force('attract', forceAttract()
      .target([width/2, height/2])
      .strength(0.01))

    // cluster by section; from 3rd party cluster library
    .force('cluster', forceCluster()
      .centers(function (d) { return clustersObj[d.cluster]; })
      .strength(0.9)
      .centerInertia(0.1))

    // apply collision with padding
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; })
      .strength(0)
      .iterations(5))

    .on('tick', layoutTick)
    .nodes(nodes);
    
  var svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
        }))
      .append("g");

  var node = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .style('fill', function (d) { return color(d.cluster); })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

  function dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged (d) {
    // position of node is "fixed" to position of mouse
    // so it is not acted upon on each tick
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // runs once on load to provide smooth transition
  var transitionTime = 3000;
  var t = d3.timer(function (elapsed) {
    var dt = elapsed / transitionTime;
    simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
    if (dt >= 1.0) t.stop();
  });
    
  function layoutTick (e) {
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.radius; });
  }

})
