let form = document.querySelector("#settings");
let size = document.querySelector("#size");
let rowsCols = document.querySelector("#number");
let complete = document.querySelector(".complete");
let replay = document.querySelector(".replay");
let close = document.querySelector(".close");

let newMaze;
let newdjikstra;
let time = 0;
let pos = ['a',]

form.addEventListener("submit", generateMaze);
replay.addEventListener("click", () => {
  location.reload();
});

close.addEventListener("click", () => {
  complete.style.display = "none";
});

function generateMaze(e) {
  e.preventDefault();

  if (rowsCols.value == "" || size.value == "") {
    return alert("Please enter all fields");
  }

  let mazeSize = size.value;
  let number = rowsCols.value;
  if (mazeSize > 600 || number > 50) {
    alert("Maze too large!");
    return;
  }

  form.style.display = "none";

  newMaze = new Maze(mazeSize, number, number);
  newMaze.setup();
  newMaze.draw();

}

function djikstra(rowsCols) {
  var graph = new WeightedGraph();

  for (var i = 0; i < rowsCols; i++) {
    for (var j = 0; j < rowsCols; j++) {
      graph.addVertex(`${i},${j}`);
    }
  }

  for (var i = 0; i < rowsCols; i++) {
    for (var j = 0; j < rowsCols; j++) {

      if (!newMaze.grid[i][j].walls.bottomWall) {
        graph.addEdge(`${i},${j}`, `${i + 1},${j}`, 1);
        // console.log("bottom: ", `${i},${j}`, `${i + 1},${j}`);
      }
      if (!newMaze.grid[i][j].walls.rightWall) {
        graph.addEdge(`${i},${j}`, `${i},${j + 1}`, 1);
        // console.log("right: ", `${i},${j}`, `${i},${j + 1}`);
      }
      if (!newMaze.grid[i][j].walls.leftWall) {
        graph.addEdge(`${i},${j}`, `${i},${j - 1}`, 1);
        // console.log("left: ", `${i},${j}`, `${i},${j - 1}`);
      }
      if (!newMaze.grid[i][j].walls.topWall) {
        graph.addEdge(`${i},${j}`, `${i - 1},${j}`, 1);
        // console.log("top:", `${i},${j}`, `${i - 1},${j}`);
      }
    }
  }

  console.log("topWall: ", newMaze);

  const result = permutator([0, 1, 2])

  let a, b, c, d, path, temp = 0, pos;
  for (var i = 0; i < 6; i++) {
    a = graph.Dijkstra(`${0},${0}`, `${newMaze.res_egg[result[i][0]][0]},${newMaze.res_egg[result[i][0]][1]}`);
    b = graph.Dijkstra(`${a[a.length - 1]}`, `${newMaze.res_egg[result[i][1]][0]},${newMaze.res_egg[result[i][1]][1]}`)
    c = graph.Dijkstra(`${b[b.length - 1]}`, `${newMaze.res_egg[result[i][2]][0]},${newMaze.res_egg[result[i][2]][1]}`)
    d = graph.Dijkstra(`${c[c.length - 1]}`, `${rowsCols - 1},${rowsCols - 1}`)
    b.shift();
    c.shift();
    d.shift();
    pos = a.concat(b, c, d);
    console.log("tamanho: ", pos);
    if (pos.length < temp || temp == 0) {
      console.log("é menor: ", pos.length);
      console.log("temp: ", temp);
      temp = pos.length;
      path = pos;
    }

  }

  moveBlock(path);

}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
  Dijkstra(start, finish) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = []; //to return at end
    let smallest; newdjikstra;
    //build up initial state
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    return path.concat(smallest).reverse();
  }
}

function moveBlock(path) {
  if (!generationComplete) return;
  let row = current.rowNum;
  let col = current.colNum;

  for (let i = 1; i < path.length; i++) {

    setTimeout(function () {
      ii = position_i(path[i]);
      jj = position_j(path[i], Number(ii[1]));
      let next = newMaze.grid[ii[0]][jj];
      current = next;
      newMaze.draw();
      current.highlight(newMaze.columns);
      if (current.goal) complete.style.display = "block";


    }, 50 * time);
    time++;

  }

}

function position_i(path) {

  let temp = '';
  let i = 0;
  while (path[i] != ",") {
    temp = temp + path[i];
    console.log("temp0: ", temp)
    i++;
  }

  return [Number(temp), i + 1];

}

function position_j(path, i) {
  let temp = ''
  let j = i;
  while (path[j] != undefined) {

    temp = temp + path[j];
    console.log("temp1: ", temp)
    j++;
  }

  return Number(temp);

}
