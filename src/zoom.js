import * as d3 from 'd3';
import {svg, nodes} from './index';

export const zoom = d3.zoom()
.scaleExtent([0.01,10])
.on("zoom", zoomed);  

function zoomed() {
  svg.attr("transform", d3.event.transform);
}  


