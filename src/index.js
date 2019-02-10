import * as d3 from 'd3';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';

const width = 960;
const height = 500;
const standardRadius = 12;
const padding = .5; // separation between same-color nodes

var color = d3.scaleOrdinal(d3.schemeCategory20)
    .domain(d3.range(20));


d3.json("./data/testd3dataNoSalesDept.json", function(error, root) {

  // create the circle pack algorithm
  // only used once to optimize initial clustering
  var pack = d3.pack()
    .size([(width), (height)])
    .padding(0);  

  // create the hierarchy for pack  
  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
      
  // circle pack the data    
  var thePack = pack(root);  

  const depts = [];
  const subdepts = [];
  const brands = [];
  const products = [];

  // extract the levels of nodes for use later
  // but not sure why I'm extracting from thePack for anything below subdept
  thePack.children.forEach(d => {
    depts.push(d);
    d.children.forEach(sd => {
      subdepts.push(sd);
      sd.children.forEach(b => {
        brands.push(b);
        b.children.forEach(p => {
          products.push(p);
        })
      })
    });
  });

  // an object for all clusters at all depth levels
  var clustersObj = {};

  // assign nodes to a cluster
  function clusterize (n) {
    n.radius = standardRadius;
    // each child is assigned to a cluster named after its parent
    n.cluster = n.parent.data.name;

    // each cluster's value is the largest child
    if (!clustersObj[n.cluster] || (n.data.value > clustersObj[n.cluster].value)) clustersObj[n.cluster] = n;

  }

  subdepts.forEach(sd => clusterize(sd));  
  brands.forEach(b => clusterize(b));
  products.forEach(p => clusterize(p));

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
    .nodes(subdepts);
    
  // add svg and apply zooming  
  var svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
      }))
      .append("g");

  var node = svg.selectAll('circle')
    .data(subdepts)
    .enter().append('circle')
      .style('fill', function (d) { 
        return color(d.cluster); 
      })
      .on('click', clicked);
  
    function clicked(parentData) {
      
      brands.forEach(b => {
        if (b.cluster == parentData.data.name) {
          b.x = parentData.x;
          b.y = parentData.y;
          subdepts.push(b);
        }
      })
      node
        .data(subdepts)
        .enter().append('circle')
        .style('fill', function (d) { 
          return color(d.cluster); 
        })
      console.log('OTHER',node)
      simulation.nodes(subdepts).alphaTarget(0.3).restart();

    }
    
  function layoutTick (e) {
    console.log(node)
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.radius; });
  }


  // runs once on load to provide smooth transition
  var transitionTime = 3000;
  var t = d3.timer(function (elapsed) {
    var dt = elapsed / transitionTime;
    simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
    if (dt >= 1.0) t.stop();
  });
})
