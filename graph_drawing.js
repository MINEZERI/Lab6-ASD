'use strict';
export default class GraphDrawing {
	
	constructor(canvas, graph, nodeRadius) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d')
		this.graph = graph;
		this.nodeRadius = nodeRadius;
		this.nodesList = [];
	}
	
	drawNode = (x, y, text = '') => {
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = '20px Arial';
		
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI, false)
		this.ctx.fillText(text, x, y);
		this.ctx.stroke();
		this.ctx.closePath();
		this.nodesList.push({x: x, y: y});
	}
	
	drawFigure = (nodesNum) => {
		const length = Math.round((nodesNum + 1) / 4);
		const distance = this.canvas.height / (length + 1);
		const path = distance * length;
		let modDistance = distance;
		if (length !== 1) modDistance = path / (length - 1);
		let currentX = this.canvas.width / 2 + distance * length / 2;
		let currentY = this.canvas.height / 2 - distance * length / 2;
		let coefficient = 1;
		let num = 1;
		let biggerSidesNum = (nodesNum - 1) % 4;	//отримаємо кількість сторін більших за інші
		for (let i = 0; i < 4; i++) {
			let index;
			let tempDistance;
			if (biggerSidesNum > 0) {
				tempDistance = distance * coefficient;
				index = length;
			} else {
				tempDistance = modDistance * coefficient;
				index = length - 1;
			}
			for (let j = 0; j < index; j++) {
				if (i % 2 === 0) {
					this.drawNode(currentX, currentY, num);
					currentX -= tempDistance;
				}
				if (i % 2 === 1) {
					this.drawNode(currentX, currentY, num);
					currentY += tempDistance;
				}
				num++;
			}
			biggerSidesNum--;
			if (i % 2 === 1) {
				coefficient *= -1;
			}
		}
		this.drawNode(this.canvas.width / 2, this.canvas.height / 2, num);
	}
	
	drawArrow = (x, y, angle, length) => {
		
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x - Math.cos(angle - Math.PI / 4) * length, y - Math.sin(angle - Math.PI / 4) * length);
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x - Math.cos(angle + Math.PI / 4) * length, y - Math.sin(angle + Math.PI / 4) * length);
		
	}
	
	isNodeBetween(point1, point2, checkPoint) {
		if (point1.x <= checkPoint.x && checkPoint.x <= point2.x || point2.x <= checkPoint.x && checkPoint.x <= point1.x) {
			if (point1.y <= checkPoint.y && checkPoint.y <= point2.y || point2.y <= checkPoint.y && checkPoint.y <= point1.y) {
				const vector1 = {x: checkPoint.x - point1.x, y: checkPoint.y - point1.y};
				const vector2 = {x: point2.x - checkPoint.x, y: point2.y - checkPoint.y};
				return vector1.x / vector1.y === vector2.x / vector2.y;
			}
		}
		return false;
	}
	
	drawLine = (startNode, endNode, i, j) => {
		const vectorX = endNode.x - startNode.x;
		const vectorY = endNode.y - startNode.y;
		const angle = Math.atan2(vectorY, vectorX);
		let startX = startNode.x + Math.cos(angle) * this.nodeRadius;
		let startY = startNode.y + Math.sin(angle) * this.nodeRadius;
		let endX = endNode.x - Math.cos(angle) * this.nodeRadius;
		let endY = endNode.y - Math.sin(angle) * this.nodeRadius;
		const length = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
		const middleX = (startX + endX) / 2;
		const middleY = (startY + endY) / 2;
		const offsetX = length / 4 * Math.cos(angle + Math.PI / 2);
		const offsetY = length / 4 * Math.sin(angle + Math.PI / 2);
		const intermediateX = middleX + offsetX;
		const intermediateY = middleY + offsetY;
		
		let isNodeBetween = false;
		let hasTwoEdges = false;
		if (this.graph.isDirected) hasTwoEdges = this.graph.adjacencyMatrix[i][j] === this.graph.adjacencyMatrix[j][i];
		for (let i = 0; i < this.nodesList.length; i++) {
			isNodeBetween = this.isNodeBetween(startNode, endNode, this.nodesList[i]);
			if (isNodeBetween) break;
		}
		
		this.ctx.beginPath();
		if (!isNodeBetween && !hasTwoEdges) {
			this.ctx.moveTo(startX, startY);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle, this.nodeRadius / 2);
		} else if (isNodeBetween) {
			this.ctx.moveTo(startX, startY);
			this.ctx.arcTo(intermediateX, intermediateY, endX, endY, length);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle - Math.PI / 6, this.nodeRadius / 2);
		} else {
			const edgeOffset = Math.PI / 16;
			startX = startNode.x + Math.cos(angle + edgeOffset) * this.nodeRadius;
			startY = startNode.y + Math.sin(angle + edgeOffset) * this.nodeRadius;
			endX = endNode.x - Math.cos(angle - edgeOffset) * this.nodeRadius;
			endY = endNode.y - Math.sin(angle - edgeOffset) * this.nodeRadius;
			this.ctx.moveTo(startX, startY);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle, this.nodeRadius / 2);
		}
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	drawLineBack = (node) => {
		const vectorX = node.x - window.innerWidth / 2;
		const vectorY = node.y - window.innerHeight / 2;
		const angle = Math.atan2(vectorY, vectorX);
		const counterclockwise = false;
		const startX = node.x + Math.cos(angle) * this.nodeRadius;
		const startY = node.y + Math.sin(angle) * this.nodeRadius;
		let arrowX;
		let arrowY;
		if (counterclockwise) {
			arrowX = node.x + Math.cos(angle - Math.PI / 6) * this.nodeRadius;
			arrowY = node.y + Math.sin(angle - Math.PI / 6) * this.nodeRadius;
		} else {
			arrowX = node.x + Math.cos(angle + Math.PI / 6) * this.nodeRadius;
			arrowY = node.y + Math.sin(angle + Math.PI / 6) * this.nodeRadius;
		}
		
		this.ctx.beginPath();
		this.ctx.arc(startX, startY, this.nodeRadius / 2, angle - Math.PI * 9 / 16, angle + Math.PI * 9 / 16, counterclockwise);
		if (this.graph.isDirected) this.drawArrow(arrowX, arrowY, angle + Math.PI, this.nodeRadius / 2);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	decisionLine = (i, j) => {
		if (i === j) this.drawLineBack(this.nodesList[j]);
		else this.drawLine(this.nodesList[i], this.nodesList[j], i, j);
	}
	
	drawGraph = (nodesNum) => {
		this.drawFigure(nodesNum);
		for (let i = 0; i < nodesNum; i++) {
			let index = i;
			if (this.graph.isDirected) index = nodesNum;
			for (let j = 0; j <= index; j++) {
				if (this.graph.adjacencyMatrix[i][j] === 1) {
					this.decisionLine(i, j);
				}
			}
		}
	}
	
	drawStep = (node1, node2) => {
		const x1 = this.nodesList[node1].x;
		const y1 = this.nodesList[node1].y;
		const x2 = this.nodesList[node2].x;
		const y2 = this.nodesList[node2].y;
		this.drawNode(x1, y1);
		this.drawNode(x2, y2);
		this.drawLine(this.nodesList[node1], this.nodesList[node2], node1, node2);
	}
}