'use strict';
import GraphManipulation from "./graph_manipulation.js"
import GraphDrawing from "./graph_drawing.js"

const canvas = document.getElementById('graphCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const n1 = 3;
const n2 = 2;
const n3 = 1;
const n4 = 9;
const k = 1 - n3 * 0.01 - n4 * 0.005 - 0.15;
const nodesNum = 10 + n3;
const nodeRadius = 30;

const graph = new GraphManipulation(nodesNum);
const graphDraw = new GraphDrawing(canvas, graph, nodeRadius);

let path = [];
let traversalTree = [];
let indicator = 0;
document.getElementById("switch").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	
	const generator = new Math.seedrandom([n1, n2, n3, n4].join);
	graph.isDirected = !graph.isDirected;
	graph.randm(generator);
	graph.mulmr(k);
	if (graph.isDirected === false) graph.undirectMatrix();
	//for (let i = 0; i < graph.adjacencyMatrix.length; i++) graph.adjacencyMatrix[i].fill(1);
	console.log("adjacency matrix", graph.adjacencyMatrix);
	
	const nodesDegrees = graph.calcNodesDegrees();
	const isRegular = graph.isRegular();
	const isolatedList = graph.isolatedNodes();
	const pendantList = graph.pendantNodes();
	
	console.log("degrees of each node", nodesDegrees);
	console.log("is graph regular, if so - outputs degree:", isRegular);
	console.log("list of isolated nodes", isolatedList);
	console.log("list of pendant nodes", pendantList);
	
	graphDraw.drawGraph(nodesNum);
});

document.getElementById("condensation").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	
	const generator = new Math.seedrandom([n1, n2, n3, n4].join);
	graph.isDirected = true;
	graph.randm(generator);
	graph.mulmr(k);
	graphDraw.drawGraph(nodesNum);
	
	const nodesDegrees = graph.calcNodesDegrees();
	const pathsOfThree = graph.getAllPaths(3);
	const pathsOfTwo = graph.getAllPaths(2);
	const reachabilityMatrix3 = graph.getReachabilityMatrix(3);
	const matrixOfStrongConnection = graph.getMatrixOfStrongConnection(3);
	const SCCs = graph.getSCCs();
	const condensationMatrix = graph.getCondensationMatrix();
	
	console.log("adjacency matrix", graph.adjacencyMatrix);
	console.log("nodes degrees", nodesDegrees);
	console.log("list of paths of length 3", pathsOfThree);
	console.log("list of paths of length 2", pathsOfTwo);
	console.log("reachability matrix of paths up to length 3", reachabilityMatrix3);
	console.log("matrix of strong connection", matrixOfStrongConnection);
	console.log("list of SCCs", SCCs);
	console.log("condensation graph", condensationMatrix);
	
});

document.getElementById("dfs").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	graphDraw.drawGraph(nodesNum);
	
	traversalTree = [];
	const treeMatrix = new Array(nodesNum);
	for (let i = 0; i < nodesNum; i++) {
		treeMatrix[i] = new Array(nodesNum).fill(0);
	}
	const sccs = graph.getSCCs();
	const adjacencyList = graph.makeAdjList();
	
	for (let i = 0; i < sccs.length; i++) {
		const component = sccs[i];
		const path = [];
		
		for (let vertex of graph.dfs(component[0])) {
			if (!path.includes(vertex)) path.push(vertex);
		}
		
		for (let j = 1; j < path.length; j++) {
			let beginIndex = j - 1;
			let begin = path[beginIndex];
			const target = path[j];
			
			while (!adjacencyList[begin].includes(target)) {
				beginIndex--;
				begin = path[beginIndex];
			}
			
			traversalTree.push({begin: begin, target: target});
			treeMatrix[begin][target] = 1;
		}
	}
	
	console.log("traversal tree", traversalTree);
	console.log("dfs path", path);
	console.log("tree adjacency matrix", treeMatrix);
	console.log("adjacency list", graph.makeAdjList());
	indicator = 0;
});

document.getElementById("bfs").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	graphDraw.drawGraph(nodesNum);
	
	traversalTree = [];
	const treeMatrix = new Array(nodesNum);
	const visited = new Array(nodesNum).fill(false);
	
	for (let i = 0; i < nodesNum; i++) {
		treeMatrix[i] = new Array(nodesNum).fill(0);
	}
	
	const sccs = graph.getSCCs();
	const adjacencyList = graph.makeAdjList();
	
	for (let i = 0; i < sccs.length; i++) {
		const component = sccs[i];
		const path = [];
		
		for (let vertex of graph.bfs(component[0])) {
			if (!path.includes(vertex)) path.push(vertex);
		}
		
		for (let i = 0; i < path.length; i++) {
			const currentVertex = path[i];
			visited[currentVertex] = true;
			
			for (let neighbor of adjacencyList[currentVertex]) {
				if (!visited[neighbor]) {
					visited[neighbor] = true;
					traversalTree.push({begin: currentVertex, target: neighbor});
					treeMatrix[currentVertex][neighbor] = 1;
				}
			}
		}
	}
	
	console.log("traversal tree", traversalTree);
	console.log("bfs path", path);
	console.log("tree adjacency matrix", treeMatrix);
	console.log("adjacency list", graph.makeAdjList());
	indicator = 0;
});


document.getElementById("next step").addEventListener("click", () => {
	context.strokeStyle = '#D6AE01';
	context.lineWidth = 5;
	if (indicator >= nodesNum - 1) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		graphDraw.drawGraph(nodesNum);
		indicator = 0;
	} else {
		graphDraw.drawStep(traversalTree[indicator].begin, traversalTree[indicator].target);
		indicator++;
	}
});




