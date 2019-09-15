import { GRID_UNIT_SIZE } from "./snapToGrid";

export const imageSize = {
  "product" : GRID_UNIT_SIZE,
  "brand" : 2*GRID_UNIT_SIZE,
  "subdept" : 2*GRID_UNIT_SIZE,
  "dept" : 3*GRID_UNIT_SIZE
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