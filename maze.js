// DEPTH FIRST SEARCH MAZE IMPLEMENTATION IN JAVASCRIPT BY CONOR BAILEY

// Initialize the canvas
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;

let current;
let goal;
let first = false;

class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}



class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
    this.res_egg = [];

  }




}

class Cell {
  // Constructor takes in the rowNum and colNum which will be used as coordinates to draw on the canvas.
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
    this.goal = false;
    this.egg = false;
    this.egg2 = false;
    this.egg3 = false;
    // parentGrid is passed in to enable the checkneighbours method.
    // parentSize is passed in to set the size of each cell on the grid
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }












}