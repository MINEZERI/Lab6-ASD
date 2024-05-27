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
let k = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
const nodesNum = 10 + n3;
const nodeRadius = 30;

const Graph = new GraphManipulation(nodesNum);
const GraphDraw = new GraphDrawing(canvas, Graph, nodeRadius);
document.getElementById("switch").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	const k = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
	const generator = new Math.seedrandom([n1, n2, n3, n4].join);
	
	Graph.isDirected = !Graph.isDirected;
	Graph.randm(generator);
	Graph.mulmr(k);
	if (Graph.isDirected === false) Graph.undirectMatrix();
	//for (let i = 0; i < Graph.adjacencyMatrix.length; i++) Graph.adjacencyMatrix[i].fill(1);
	console.log("adjacency matrix", Graph.adjacencyMatrix);
	
	const nodesDegrees = Graph.calcNodesDegrees();
	const isRegular = Graph.isRegular();
	const isolatedList = Graph.isolatedNodes();
	const pendantList = Graph.pendantNodes();
	
	console.log("degrees of each node", nodesDegrees);
	console.log("is graph regular, if so - outputs degree", isRegular);
	console.log("list of isolated nodes ", isolatedList);
	console.log("list of pendant nodes ", pendantList);
	
	GraphDraw.drawGraph(nodesNum);
});
document.getElementById("condensation").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	const generator = new Math.seedrandom([n1, n2, n3, n4].join);
	const k = 1 - n3 * 0.005 - n4 * 0.005 - 0.27;
	Graph.isDirected = true;
	Graph.randm(generator);
	Graph.mulmr(k);
	GraphDraw.drawGraph(nodesNum);
	
	const nodesDegrees = Graph.calcNodesDegrees();
	const pathsOfThree = Graph.getAllPaths(3);
	const pathsOfTwo = Graph.getAllPaths(2);
	const reachabilityMatrix3 = Graph.getReachabilityMatrix(3);
	const matrixOfStrongConnection = Graph.getMatrixOfStrongConnection(3);
	const SCCs = Graph.findSCCs();
	const condensationMatrix = Graph.getCondensationMatrix();
	
	console.log("adjacency matrix", Graph.adjacencyMatrix);
	console.log("nodes degrees", nodesDegrees);
	console.log("list of paths of length 3", pathsOfThree);
	console.log("list of paths of length 2", pathsOfTwo);
	console.log("reachability matrix of paths up to length 3", reachabilityMatrix3);
	console.log("matrix of strong connection", matrixOfStrongConnection);
	console.log("squared reachability matrix", Graph.matrixPow(reachabilityMatrix3, 3));
	console.log("list of SCCs", SCCs);
	console.log("condensation graph", condensationMatrix);
	
});






