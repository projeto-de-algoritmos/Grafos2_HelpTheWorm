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



