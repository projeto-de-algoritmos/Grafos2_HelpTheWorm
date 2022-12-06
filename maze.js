// Initialize the canvas
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;

const worm = new Image();
worm.addEventListener("load", () => {}, false);
worm.src = "./assets/imgs/worm.png";

const boostpng = new Image();
boostpng.addEventListener("load", () => {}, false);
boostpng.src = "./assets/imgs/boost.png";

const mother = new Image();
mother.addEventListener("load", () => {}, false);
mother.src = "./assets/imgs/worriedmother.png";

const happymother = new Image();
happymother.addEventListener("load", () => {}, false);
happymother.src = "./assets/imgs/motherhappy.png";

const wormrole = new Image();
wormrole.addEventListener("load", () => {}, false);
wormrole.src = "./assets/imgs/wormrole.jpeg";

let current;
let goal;
let first = false;
let visitedworms = [false, false, false];

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
  if ((let_x === 0 && let_y === 0) || (let_x === max && let_y === max)) {
    return randomNumber(min, max);
  } else return [let_x, let_y];
}

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
    this.res_egg = [];
    this.boost = [];
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
    this.grid[this.res_egg[0][0]][this.res_egg[0][1]].egg[0] = true;
    this.res_egg[1] = randomNumber(0, this.rows - 1);
    console.log("res_egg2: ", this.res_egg[1]);
    this.grid[this.res_egg[1][0]][this.res_egg[1][1]].egg[1] = true;
    this.res_egg[2] = randomNumber(0, this.rows - 1);
    console.log("res_egg3: ", this.res_egg[2]);
    this.grid[this.res_egg[2][0]][this.res_egg[2][1]].egg[2] = true;

    let aux1 = randomNumber(0, this.rows - 1);
    while (
      aux1 === this.res_egg[0] ||
      aux1 === this.res_egg[1] ||
      aux1 === this.res_egg[2]
    ) {
      aux1 = randomNumber(0, this.rows - 1);
    }
    this.res_egg[3] = aux1;
    this.grid[this.res_egg[3][0]][this.res_egg[3][1]].egg[3] = 500;

    let aux2 = randomNumber(0, this.rows - 1);
    while (
      aux2 === this.res_egg[0] ||
      aux2 === this.res_egg[1] ||
      aux2 === this.res_egg[2] ||
      aux2 === this.res_egg[3]
    ) {
      aux2 = randomNumber(0, this.rows - 1);
    }
    this.res_egg[4] = aux2
    this.grid[this.res_egg[4][0]][this.res_egg[4][1]].egg[4] = 500;
  }

  // Draw the canvas by setting the size and placing the cells in the grid array on the canvas.
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.backgroundImage = "url('./assets/imgs/grass.jpeg')";
    // Set the first cell as visited
    console.log("currentssss: ", current);
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
        djikstra(this.columns);
      }
      return;
    }
    // Recursively call the draw function. This will be called up until the stack is empty
    window.requestAnimationFrame(() => {
      this.draw();
    });
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
    this.egg = [false, false, false, 1000, 1000];

    // parentGrid is passed in to enable the checkneighbours method.
    // parentSize is passed in to set the size of each cell on the grid
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }

  removeWalls(cell1, cell2) {
    // compares to two cells on x axis
    let x = cell1.colNum - cell2.colNum;
    // Removes the relevant walls if there is a different on x axis
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }
    // compares to two cells on x axis
    let y = cell1.rowNum - cell2.rowNum;
    // Removes the relevant walls if there is a different on x axis
    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

    // The following lines push all available neighbours to the neighbours array
    // undefined is returned where the index is out of bounds (edge cases)
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    // if the following are not 'undefined' then push them to the neighbours array
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    // Choose a random neighbour from the neighbours array
    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  // Wall drawing functions for each cell. Will be called if relevent wall is set to true in cell constructor
  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  // Highlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
  highlight(columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    console.log("x: ", x);
    console.log("y: ", y);
    ctx.fillStyle = "transparent";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
    ctx.drawImage(
      mother,
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
    if (visitedworms[0] && visitedworms[1] && visitedworms[2]) {
      ctx.clearRect(
        x,
        y,
        this.parentSize / columns - 3,
        this.parentSize / columns - 3
      );
      ctx.drawImage(
        happymother,
        x,
        y,
        this.parentSize / columns - 3,
        this.parentSize / columns - 3
      );
    }
  }

  // Draws each of the cells on the maze canvas
  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "transparent";
    ctx.lineWidth = 2;
    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = "transparent";
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      ctx.drawImage(
        wormrole,
        x + 1,
        y + 1,
        size / columns - 2,
        size / columns - 2
      );
    }

    if (this.egg[0]) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      ctx.drawImage(worm, x + 1, y + 1, size / columns - 2, size / columns - 2);
    }
    if (this.egg[1]) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      ctx.drawImage(worm, x + 1, y + 1, size / columns - 2, size / columns - 2);
    }
    if (this.egg[2]) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      ctx.drawImage(worm, x + 1, y + 1, size / columns - 2, size / columns - 2);
    }
    if (this.egg[3] === 500) {
      ctx.drawImage(
        boostpng,
        x + 1,
        y + 1,
        size / columns - 2,
        size / columns - 2
      );
    }

    if (this.egg[4] === 500) {
      ctx.drawImage(
        boostpng,
        x + 1,
        y + 1,
        size / columns - 2,
        size / columns - 2
      );
    }

    if (this.egg[0] == 3) {
      ctx.fillStyle = "transparent";
      ctx.clearRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      visitedworms[0] = true;
    }
    if (this.egg[1] == 3) {
      ctx.fillStyle = "transparent";
      ctx.clearRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      visitedworms[1] = true;
    }
    if (this.egg[2] == 3) {
      ctx.fillStyle = "";
      ctx.clearRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      visitedworms[2] = true;
    }
  }
}
