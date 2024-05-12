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
const k = 1.0 - n3 * 0.02 - n4 * 0.005 - 0.25;
const nodesNum = 10 + n3;
const nodeRadius = 30;
const Graph = new GraphManipulation(nodesNum);

const GraphDraw = new GraphDrawing(canvas, Graph, nodeRadius);

document.getElementById("switch").addEventListener("click", () => {
	console.clear();
	context.clearRect(0, 0, canvas.width, canvas.height);
	const generator = new Math.seedrandom([n1, n2, n3, n4].join);
	Graph.isDirected = !Graph.isDirected;
	Graph.randm(generator);
	Graph.mulmr(k);
	if (Graph.isDirected === false) Graph.undirectMatrix();
	//for (let i = 0; i < Graph.adjacencyMatrix.length; i++) Graph.adjacencyMatrix[i].fill(1);
	console.log(Graph.adjacencyMatrix);
	GraphDraw.drawGraph(nodesNum);
});






