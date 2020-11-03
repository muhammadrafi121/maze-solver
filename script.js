let w = 20;
let grid = [];
let rows, cols;
let curr;
let stack = [];

let path = [];
let start, goal;
let openSet = [];
let closedSet = [];

function setup() {
	createCanvas(600, 600);
	// frameRate(5);
	rows = floor(width / w);
	cols = floor(height / w);

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid.push(new Cell(i, j));
		}
	}
	let r = floor(random() * grid.length);
	let first = grid[r];
	first.visited = true;
	stack.push(first);

	while (stack.length > 0) {
		curr = stack.pop();
		let next = curr.getNeighbor();
		if (next) {
			stack.push(curr);
			removeWall(curr, next);
			next.visited = true;
			stack.push(next);
		}
	}

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid[getIndex(i, j)].addNeighbor();
		}
	}

	start = grid[0];
	goal = grid[grid.length - 1];
	openSet.push(start);
}

function draw() {
	background(100);
	for (let i = 0; i < grid.length; i++) {
		grid[i].show();
	}

	let current;
	if (openSet.length > 0) {
		let winner = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}

		current = openSet[winner];

		if (current == goal) {
			noLoop();
			console.log("DONE");
		}

		removeFromArray(openSet, current);
		closedSet.push(current);

		let neighbors = current.neighbors;
		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];

			if (!closedSet.includes(neighbor)) {
				let tempG = current.g + 1;
				let newPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				if (newPath) {
					neighbor.h = heuristic(neighbor, goal);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.prev = current;
				}
			}
		}
	}

	path = [];
	let temp = current;
	path.push(current);
	while (temp.prev) {
		path.push(temp.prev);
		temp = temp.prev;
	}

	noStroke();
	fill(0, 255, 0, 150);
	for (let i = 0; i < path.length; i++) {
		rect(path[i].i*w, path[i].j*w, w, w);
	}
}

function getIndex(i, j) {
	if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
		return -1;
	}
	return i + j * cols;
}

function removeWall(a, b) {
	let x = a.i - b.i;
	if (x == 1) {
		a.wall[3] = false;
		b.wall[1] = false;
	} else if (x == -1) {
		a.wall[1] = false;
		b.wall[3] = false;
	}

	let y = a.j - b.j;
	if (y == 1) {
		a.wall[0] = false;
		b.wall[2] = false;
	} else if (y == -1) {
		a.wall[2] = false;
		b.wall[0] = false;
	}
}

function removeFromArray(arr, elmt) {
	for (let i = arr.length-1; i >= 0; i--) {
		if (arr[i] === elmt) {
			arr.splice(i, 1);
		}
	}
}

function heuristic(a, b) {
	// return dist(a.i, a.j, b.i, b.j);
	return (abs(a.i-b.i) + abs(a.j-b.j));
}


function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = []; // neighbors for A*
	this.wall = [true, true, true, true];
	this.visited = false;
	this.prev = undefined;

	// neighbors for Maze Generator
	this.getNeighbor = function() {
		let neighbors = [];
		let top    = grid[getIndex(this.i, this.j-1)];
		let right  = grid[getIndex(this.i+1, this.j)];
		let bottom = grid[getIndex(this.i, this.j+1)];
		let left   = grid[getIndex(this.i-1, this.j)];

		if (top && !top.visited) {
			neighbors.push(top);
		}
		if (right && !right.visited) {
			neighbors.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if (left && !left.visited) {
			neighbors.push(left);
		}

		// console.log(neighbors.length);

		if (neighbors.length > 0) {
			let r = floor(random() * neighbors.length);
			return neighbors[r];
		} else {
			return undefined;
		}
	}

	this.show = function() {
		let x = this.i * w;
		let y = this.j * w;

		stroke(255);

		if (this.wall[0]) {
			line(x, y, x + w, y);
		}
		if (this.wall[1]) {
			line(x + w, y, x + w, y + w);
		}
		if (this.wall[2]) {
			line(x + w, y + w, x, y + w);
		}
		if (this.wall[3]) {
			line(x, y, x, y + w);
		}

		if (this.visited) {
			noStroke();
			fill(255, 0, 255, 100);
			rect(x, y, w, w);
		}
	}

	// Add neighbors for A* algorithm path
	this.addNeighbor = function() {
		let top    = grid[getIndex(this.i, this.j-1)];
		let right  = grid[getIndex(this.i+1, this.j)];
		let bottom = grid[getIndex(this.i, this.j+1)];
		let left   = grid[getIndex(this.i-1, this.j)];

		if (top && !this.wall[0]) {
			this.neighbors.push(top);
		}
		if (right && !this.wall[1]) {
			this.neighbors.push(right);
		}
		if (bottom && !this.wall[2]) {
			this.neighbors.push(bottom);
		}
		if (left && !this.wall[3]) {
			this.neighbors.push(left);
		}
	}
}
