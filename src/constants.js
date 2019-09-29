export const imagesURL = 'https://s3-us-west-1.amazonaws.com/consumerland/';

export const GRID_UNIT_SIZE = 200;
export const GRID_WIDTH = 150;
export const GRID_HEIGHT = 150;

const UNIT_MARGIN = GRID_UNIT_SIZE*0.1;

export const strokeColor = {
  "product" : "white",
  "brand" : "#e5e5e5",
  "subdept" : "#e5e5e5",
  "dept" : "#e5e5e5"
}

export const imageSize = {
  "product" : GRID_UNIT_SIZE - UNIT_MARGIN,
  "brand" : GRID_UNIT_SIZE - UNIT_MARGIN,
  "subdept" : 2*GRID_UNIT_SIZE - UNIT_MARGIN,
  "dept" : 3*GRID_UNIT_SIZE - UNIT_MARGIN
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
  "product" : [0,GRID_UNIT_SIZE],
  "brand" : [GRID_UNIT_SIZE/20,GRID_UNIT_SIZE/2],
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