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
import { imageSize, imagePosition, fontSize, textAnchor, textPosition } from './constants';
import { forceCollideCustom } from './forceCollideCustom';
import { forceGrid } from './forceToGrid';
//import { forceCollide, collide } from './forceCollideCustom';
import { grid, GRID_WIDTH, GRID_UNIT_SIZE, GRID_HEIGHT } from './snapToGrid';

export const depts = [];
export const subdepts = [];
export const brands = [];
export const products = [];
export let nodes = [];

export const width = GRID_WIDTH * GRID_UNIT_SIZE;
export const height = GRID_HEIGHT * GRID_UNIT_SIZE;
const scale = .2;
const zoomWidth = -width/2;
const zoomHeight = -height/2;
console.log('zoomWidth', zoomWidth)


// Add SVG canvas and zoom effect
export const svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.call(zoom)
.attr("transform", "translate(" + zoomWidth + "," + zoomHeight + ")" )
.append("g");

var node = svg.selectAll('g.node'); 

// Create nested objects for each product and dept in product set
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


  depts.forEach( d=> {
    d.x = width/2;
    d.y = height/2;
  });
  nodes = depts;
  console.log('nodes',nodes)
  update();

})

// Start or restart     
export function update() {
  grid.init();
  let t = d3.transition()
  .duration(500);
  
  nodes.forEach(d => grid.snapToGrid(d));
  node = node.data(nodes, function(d) { return d.id;})
  
  node.exit()
    .remove();

  // Enter any new nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("class", d => d.type)
    .attr("name", function (d) { return d.name; })

  // Append a rectangle
  nodeEnter.append("rect")
    .attr("name", function (d) { return d.name; })
    .attr("fill", "#fff")
    .attr("fill-opacity", 1)
    .attr("stroke", "blue")
    .transition(t)
    .attr("height", d => d.type === 'product' ? 2*imageSize[d.type] : imageSize[d.type] ) 
    .attr("width", d => d.type === 'brand' ? 2*imageSize[d.type] : imageSize[d.type])


  // Append images
  nodeEnter.append("image")
    .attr("xlink:href", function (d) { return "../images/" + (d.img || "product-images/missing-item.jpg"); })
    .attr("name", function (d) { return d.name; })
    .attr("x", d => imagePosition[d.type][0])
    .attr("y", d => imagePosition[d.type][1])
    .transition(t)
    .attr("height", d => imageSize[d.type] ) 
    .attr("width", d => imageSize[d.type])
    .attr("alignment-baseline", "middle")

  // Append title and price
  var nodeEnterText = nodeEnter.append("text")
    .attr("text-anchor", d => textAnchor[d.type])
    .attr("x", d => textPosition[d.type][0])
    .attr("y", d => textPosition[d.type][1])
    .attr("font-size", d => fontSize[d.type]);

  nodeEnterText.append("tspan")
    .attr("class", "name")
    .text(d =>  textFormatter(d.name, 25, 50)[0])
    
    
  
  nodeEnterText.append("tspan")
    .attr("class", "name")
    .text(d =>  textFormatter(d.name, 25, 50)[1])
    .attr("x", d => textPosition[d.type][0])
    .attr("dy", d => fontSize[d.type])

  nodeEnterText.append("tspan")
    .text(d =>  d.price)  
    .attr("class", "price")
    // .attr("x", d => d.type === "product" ? -d.radius : 0)
    // .attr("y", function (d) { return d.radius; });  
    
  node = nodeEnter
    .merge(node)
  
  node
    .transition(t)  
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  node.on("click",click);
  
}  


