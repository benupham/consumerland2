import { GRID_UNIT_SIZE } from "./snapToGrid";

export const imageSize = {
  "product" : GRID_UNIT_SIZE,
  "brand" : GRID_UNIT_SIZE,
  "subdept" : 2*GRID_UNIT_SIZE,
  "dept" : 3*GRID_UNIT_SIZE
}

export const imagePosition = {
  "product" : [0,0],
  "brand" : [GRID_UNIT_SIZE,0],
  "subdept" : [0,0],
  "dept" : [0,0]
}

export const textAnchor = {
  "product" : "start",
  "brand" : "start",
  "subdept" : "start",
  "dept" : "start"
}

export const textPosition = {
  "product" : [GRID_UNIT_SIZE/10,GRID_UNIT_SIZE*1.1],
  "brand" : [GRID_UNIT_SIZE/8,GRID_UNIT_SIZE/2],
  "subdept" : [GRID_UNIT_SIZE,GRID_UNIT_SIZE],
  "dept" : [GRID_UNIT_SIZE,GRID_UNIT_SIZE]
}


export const fontSize = {
  "product" : 12,
  "brand" : 20,
  "subdept" : 24,
  "dept" : 36
}

export const paddings = {
  "sameParent" : 100,
  "sameGrandParent" : 200,
  "sameGGrandParent" : 300,
  "noRelation" : 400
}