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

function randomNumber(min, max) {
  let let_x = Math.floor(Math.random() * max);
  let let_y = Math.floor(Math.random() * max);
  console.log("RANDOM NUMBER: ", let_x, let_y);
  if (let_x === 0 && let_y === 0 || let_x === max && let_y === max) {
    return randomNumber(min, max)

  }
  else
    return [let_x, let_y];
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

  // Set the grid: Create new this.grid array based on number of instance rows and columns
  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        // Create a new instance of the Cell class for each element in the 2D array and push to the maze grid array
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    // Set the starting grid
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].goal = true;


    this.res_egg[0] = randomNumber(0, this.rows - 1);
    console.log("res_egg: ", this.res_egg[0]);
    this.grid[this.res_egg[0][0]][this.res_egg[0][1]].egg = true;
    this.res_egg[1] = randomNumber(0, this.rows - 1);
    console.log("res_egg2: ", this.res_egg[1]);
    this.grid[this.res_egg[1][0]][this.res_egg[1][1]].egg2 = true;
    this.res_egg[2] = randomNumber(0, this.rows - 1);
    console.log("res_egg3: ", this.res_egg[2]);
    this.grid[this.res_egg[2][0]][this.res_egg[2][1]].egg3 = true;
  }

  // Draw the canvas by setting the size and placing the cells in the grid array on the canvas.
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    // Set the first cell as visited
    console.log("current: ", current);
    current.visited = true;
    // Loop through the 2d grid array and call the show method for each cell instance
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
    // This function will assign the variable 'next' to random cell out of the current cells available neighbouting cells
    let next = current.checkNeighbours();
    // If there is a non visited neighbour cell
    console.log("next: ", next);
    if (next) {
      next.visited = true;
      // Add the current cell to the stack for backtracking
      this.stack.push(current);
      // this function will highlight the current cell on the grid. The parameter columns is passed
      // in order to set the size of the cell
      current.highlight(this.columns);
      // This function compares the current cell to the next cell and removes the relevant walls for each cell
      current.removeWalls(current, next);
      // Set the nect cell to the current cell
      current = next;

      // Else if there are no available neighbours start backtracking using the stack
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    // If no more items in the stack then all cells have been visted and the function can be exited
    if (this.stack.length === 0) {
      generationComplete = true;
      if (first === false) {
        first = true;
       
      }

      return;
    }

    // Recursively call the draw function. This will be called up until the stack is empty
    window.requestAnimationFrame(() => {
      this.draw();
    });
    //     setTimeout(() => {rd
    //       this.draw();
    //     }, 10);
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