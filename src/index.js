import * as d3 from 'd3';
import { forceAttract } from 'd3-force-attract';
import {forceCluster} from 'd3-force-cluster';
d3.forceAttract = forceAttract;
d3.forceCluster = forceCluster;

// import {simulation} from './forceSimulation';
import {click, labelsArray} from './click';
import {zoom} from './zoom';
import {createClusteredNode, clustersObj} from './clustering';
import { textFormatter } from './utilities';
import { positionLabels } from './labels';
import { imageSize, fontSize } from './constants';
import { forceCollideCustom } from './forceCollideCustom';
//import { forceCollide, collide } from './forceCollideCustom';


export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export let nodes = [];

export const width = window.innerWidth;
export const height = window.innerHeight;
const scale = 1;
const zoomWidth = (width-scale*width)/2;
const zoomHeight = (height-scale*height)/2;

export const svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.call(zoom)
.append("g")
.attr("transform", "translate(" + zoomWidth + "," + zoomHeight + ") scale(" + scale + ")");

var node = svg.selectAll('g.node'); 


d3.json("../data/productSet.json", function(error, root) {
  console.log('root',root)

  root.forEach(d => {
    d.radius = imageSize[d.type]/2 * Math.SQRT2;
    if (d.type === 'dept') {
      depts.push(d);
    } else if (d.type === 'subdept') {  
      subdepts.push(d);
    } else if (d.type === 'brand') {
      brands.push(d);
    } else if (d.type === 'product') {
      products.push(d);
    }
  });


  depts.forEach( d=> createClusteredNode(d));
  nodes = depts;

  update();

})

//TODO: Reduce simulation for nodes over a certain distance away from click.
export const simulation = d3.forceSimulation()
// keep entire simulation balanced around screen center
// .force('center', d3.forceCenter(width/2, height/2))

// pull toward center
.force('attract', d3.forceAttract()
  .target([width/2, height/2])
  .strength(0.01))

// cluster by section
.force('cluster', d3.forceCluster()
  .centers(function (d) { return clustersObj[d.parent]; })
  .strength(0.7)
  .centerInertia(0.1))

// apply collision with padding
// .force('collide', d3.forceCollide(function (d) { return d.radius + padding; })
//   .iterations(3)
//   .strength(0))

  .force('collideCustom', forceCollideCustom())

.on('tick', layoutTick);
//.on('end', positionLabels);   

function layoutTick (e) {
  node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  //positionLabels();
}

// ramp up collision strength to provide smooth transition
// var transitionTime = 3000;
// var t = d3.timer(function (elapsed) {
//   var dt = elapsed / transitionTime;
//   simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
//   if (dt >= 1.0) t.stop();
// });


// Start or restart     
export function update() {
  let t = d3.transition()
  .duration(500);

  simulation.nodes(nodes)
  //TODO: change alpha depending on number of nodes to be added; less if fewer
  simulation.alpha(0.7).restart();

  node = node.data(nodes, function(d) { return d.id;})
  
  node.exit()
    .remove();

  // Enter any new nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("class", d => d.type)
    .attr("name", function (d) { return d.name; })
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("click", click)

  // Append a circle
  nodeEnter.append("circle")
    .attr("name", function (d) { return d.name; })
    .attr("fill", "#fff")
    .transition(t)
    .attr("r", function (d) { return d.radius; })


  // Append images
  nodeEnter.append("image")
    .attr("xlink:href", function (d) { return "../images/" + (d.img || "product-images/missing-item.jpg"); })
    .attr("name", function (d) { return d.name; })
    .attr("x", function (d) { return -imageSize[d.type] / 2; })
    .attr("y", function (d) { return -imageSize[d.type] / 2; })
    .transition(t)
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

  // Append title and price
  var nodeEnterText = nodeEnter.append("text")
    .attr("text-anchor", d => d.type === "product" ? "start" : "middle")
    .attr("x", d => d.type === "product" ? -d.radius : 0)
    .attr("y", function (d) { return imageSize[d.type]/2 + 10; })
    .attr("font-size", d => fontSize[d.type]);

  nodeEnterText.append("tspan")
    .attr("class", "name")
    .text(d =>  textFormatter(d.name, 25, 50)[0]);
    // .attr("x", d => d.type === "product" ? -d.radius : 0)
    // .attr("y", function (d) { return d.radius; })
  
  nodeEnterText.append("tspan")
    .attr("class", "name")
    .text(d =>  textFormatter(d.name, 25, 50)[1])
    .attr("x", d => d.type === "product" ? -d.radius : 0)
    .attr("y", function (d) { return d.radius + 15; });

  nodeEnterText.append("tspan")
    .text(d =>  d.price)  
    .attr("class", "price")
    .attr("x", d => d.type === "product" ? -d.radius : 0)
    .attr("y", function (d) { return d.radius; });  
    
  node = nodeEnter.merge(node);

  
}  


