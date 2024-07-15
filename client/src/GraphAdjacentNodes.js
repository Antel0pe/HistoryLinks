import './App.css';
import Graph from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import { createNodeImageProgram } from "@sigma/node-image";
import { FC, useEffect, useMemo, useState } from "react";
import { DirectedGraph } from "graphology"; 
import _, { random, sample } from 'underscore';
import newGraphNode from './GraphNode';
import { Events } from './GraphAdjacentNodes';
import CurrentPath from './CurrentPath';
import UserInput from './UserInput';
import WikipediaGraph from './WikipediaGraph';
import { MultiDirectedGraph } from "graphology";
import axios from "axios";


export class GraphAdjacentNodes{
    graphNodeNum = 0;

    constructor() {
        
    }

    resetGraphNodeNum() {
        this.graphNodeNum = 0;
    }

    createRootNode(graph, articleTitle, setSelectedLeftNodes, setSelectedRightNodes) {
        let rootNode = newGraphNode(articleTitle, this.graphNodeNum++, 0, 0, 10, 'blue');
        graph.updateNode(rootNode.nodeNum, attr => rootNode);
        console.log('added node ' + rootNode.nodeNum);
    
        setSelectedLeftNodes([rootNode.nodeNum]);
        setSelectedRightNodes([rootNode.nodeNum]);
    
        this.generateAdjacentNodes(graph, rootNode.nodeNum, -1);
        this.generateAdjacentNodes(graph, rootNode.nodeNum, 1);
        
    }

    // when a user has selected a path on nodes 2, 4, 6 we highlight those nodes
    // when a user then clicks node 3 which is on the same level as node 2, we want to deselect 2, 4, 6
    deselectNephewNodesOnClick(selectedNodes, idxToStartDeselecting, graph) {
        if (idxToStartDeselecting > selectedNodes.length) {
            return selectedNodes;
        }

        console.log('deselecting nephew nodes');
        console.log(selectedNodes);
        console.log(idxToStartDeselecting);
        let i = null;
        for (i = selectedNodes.length - 1; i >= idxToStartDeselecting;  i--){
            console.log('deselecting node @ idx ' + i);
            console.log(i > idxToStartDeselecting);

            // deselect node
            graph.setNodeAttribute(selectedNodes[i], 'color', 'red');

            // deselect edge to next node
            graph.setEdgeAttribute(selectedNodes[i - 1], selectedNodes[i], 'color', '#ccc');
        }

        // console.log('idx after loop ' + i);
        // console.log(0 <= i);
        // console.log(i < selectedNodes.length)
        // // deselect remaining node in list
        // if (0 <= idxToStartDeselecting && idxToStartDeselecting < selectedNodes.length) {
        //     graph.setNodeAttribute(selectedNodes[idxToStartDeselecting], 'color', 'red');
        // }

    }

    recordSelectedNode(graph, nodeNum, xVal, [selectedNodes, setSelectedNodes]) {
        graph.setNodeAttribute(nodeNum, 'color', 'blue');
    
        let xCoord = Math.abs(xVal);
    
        this.deselectNephewNodesOnClick(selectedNodes, xCoord, graph);
        setSelectedNodes([
            ...selectedNodes.slice(0, xCoord),
            nodeNum,
        ]);
    
    }

    // it is only legal to select a node if a node in the previous layer is selected
    // valid path must always exist
    isLegalToSelectNode(graph, xVal, nodeNum, leftList, rightList) {    
        let selectedNodeList = null;
        if (xVal === 0) {
            return false;
        } else if (xVal > 0) {
            selectedNodeList = rightList;
        } else if (xVal < 0) {
            selectedNodeList = leftList;
        }
        console.log('xCoord is ' + xVal);
        console.log(selectedNodeList);
        console.log('length of list: ' + selectedNodeList.length);

        let idx = Math.abs(xVal);

        if ((idx - 1) < selectedNodeList.length) {
            let prevNode = selectedNodeList[idx - 1];
            let prevNodeColor = graph.getNodeAttribute(prevNode, 'color');
            let doesEdgeExistFromPrevLayer = graph.hasEdge(prevNode, nodeNum);
            
            console.log('is valid to select node? prev color: ' + prevNodeColor + ' and has edge to prev node: ' + doesEdgeExistFromPrevLayer);
            console.log('prev node is ' + prevNode);

            return prevNodeColor === 'blue' && doesEdgeExistFromPrevLayer;
        } else {
            console.log('goofy if');
            return false;
        }
    }

    clickedNode(graph, nodeNum, [leftList, setLeftList], [rightList, setRightList]) {
        let node = graph.getNodeAttributes(nodeNum);

        if (!this.isLegalToSelectNode(graph, node.x, node.nodeNum, leftList, rightList)) {
            alert('invalid node to select!');
            return;
        }
    
        if (node.x < 0) {
            this.recordSelectedNode(graph, node.nodeNum, node.x, [leftList, setLeftList] );
        } else {
            this.recordSelectedNode(graph, node.nodeNum, node.x, [rightList, setRightList]);
        }
    
        this.generateAdjacentNodes(graph, node.nodeNum, node.x);
        this.colorEdgesSurroundingBlueNodes(graph, node.nodeNum);
    }
    
    generateAdjacentNodes(graph, parentNodeNum, nodeX) {
        let xCoordAdjustment = 0;
        if (nodeX < 0) {
            xCoordAdjustment = -1;
        } else if (nodeX > 0) {
            xCoordAdjustment = 1;
        }

        axios.get('http://localhost:5000/api/test')
                .then(res => {
                    this.generateAdjacentNodesWithXCoord(graph, parentNodeNum, xCoordAdjustment, res.data);
                })
    
    }
    
    generateAdjacentNodesWithXCoord(graph, parentNodeNum, xCoordAdjustment, adjacentNodeNames) {
        let node = graph.getNodeAttributes(parentNodeNum);
    
        let adjacentNodes = [];
        // let adjacentNodeNames = this.getAdjacentNodeNames();
    
        let adjacentX = node.x + xCoordAdjustment;
        let adjacentY = node.y + 1;
        for (let i = 0; i < adjacentNodeNames.length; i++){
            let newNode = newGraphNode(adjacentNodeNames[i], this.graphNodeNum++, adjacentX, adjacentY - i, 10, 'red');

            adjacentNodes.push(newNode);
        }
    
    
        for (let i = 0; i < adjacentNodes.length; i++) {
            console.log('creating edge between parent ' + node.label + ' and child ' + adjacentNodes[i].label);
            graph.updateNode(adjacentNodes[i].nodeNum, attr => adjacentNodes[i]);

            graph.updateEdge(parentNodeNum, adjacentNodes[i].nodeNum, attr => { 
                return {
                    color: attr.color ? attr.color : 'grey'
                }
            });
        }
    }
    
    colorEdgesSurroundingBlueNodes(graph, nodeKey) {
        graph.filterEdges(nodeKey, (e, _, source, target, sourceAttributes, targetAttributes) => {
            return source === nodeKey && targetAttributes.color === 'blue' ||
                target === nodeKey && sourceAttributes.color === 'blue';
        }).forEach((e) => graph.setEdgeAttribute(e, 'color', 'blue'));
    }
    
    getAdjacentNodeNames() {
        let randomList = ['ancient greece', 'persia', 'roman empire', 'nubia', 'mesopotamia', 'zhou dynasty', 'hittites', 'ancient egypt', 'aztecs', 'vedic civilizations', 'carthage', 'indus valley'];
    
        let random_sample = _.sample(randomList, 3);
    
        return random_sample;
        // return ['', '', ''];
    }
    

}

