'use strict';
export default class GraphManipulation {
	constructor(nodesNum) {
		this.nodesNum = nodesNum;
		this.isDirected = false;
		this.adjacencyMatrix = [];
		for (let i = 0; i < this.nodesNum; i++) {
			this.adjacencyMatrix[i] = [];
		}
	}
	
	randm = generator => {
		for (let i = 0; i < this.adjacencyMatrix.length; i++) {
			for (let j = 0; j < this.adjacencyMatrix.length; j++) {
				this.adjacencyMatrix[i][j] = generator() * 2;
			}
		}
	}
	
	mulmr = k => {
		for (let i in this.adjacencyMatrix) {
			for (let j in this.adjacencyMatrix[i]) {
				this.adjacencyMatrix[i][j] = this.adjacencyMatrix[i][j] * k >= 1 ? 1 : 0;
			}
		}
	}
	
	undirectMatrix = () => {
		for (let i in this.adjacencyMatrix) {
			for (let j in this.adjacencyMatrix[i]) {
				if (this.adjacencyMatrix[i][j] === 1) this.adjacencyMatrix[j][i] = 1;
			}
		}
	}
	
}