import { GRID_UNIT_SIZE } from "./snapToGrid";

export const imageSize = {
  "product" : 0.8*GRID_UNIT_SIZE,
  "brand" : GRID_UNIT_SIZE,
  "subdept" : 2*GRID_UNIT_SIZE,
  "dept" : 3*GRID_UNIT_SIZE
}

export const imagePosition = {
  "product" : [0.1*GRID_UNIT_SIZE,0],
  "brand" : [0,0],
  "subdept" : [0.5*GRID_UNIT_SIZE,0.5*GRID_UNIT_SIZE],
  "dept" : [0,0]
}

export const fontSize = {
  "product" : 12,
  "brand" : 14,
  "subdept" : 16,
  "dept" : 18
}

export const paddings = {
  "sameParent" : 100,
  "sameGrandParent" : 200,
  "sameGGrandParent" : 300,
  "noRelation" : 400
}