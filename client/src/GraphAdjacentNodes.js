import './App.css';
import _ from 'underscore';
import newGraphNode from './GraphNode';
import axios from "axios";


export class GraphAdjacentNodes{
    graphNodeNum = 0;

    resetGraphNodeNum() {
        this.graphNodeNum = 0;
    }

    createRootNode(graph, articleTitle, setSelectedLeftNodes, setSelectedRightNodes) {
        let rootNode = newGraphNode(articleTitle, this.graphNodeNum++, 0, 0, 10, 'blue', 0);
        graph.updateNode(rootNode.nodeNum, attr => rootNode);
        console.log('added node ' + rootNode.nodeNum);
    
        setSelectedLeftNodes([rootNode.nodeNum]);
        setSelectedRightNodes([rootNode.nodeNum]);
    
        this.generateAdjacentNodes(graph, rootNode.nodeNum, -1, rootNode.label);
        this.generateAdjacentNodes(graph, rootNode.nodeNum, 1, rootNode.label);
        
    }

    // when a user has selected a path on nodes 2, 4, 6 we highlight those nodes
    // when a user then clicks node 3 which is on the same level as node 2, we want to deselect 2, 4, 6
    // deselects sibling node as well
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
            let [source, target] = this.getSourceAndTargetNodeNumOfEdge(
                graph.getNodeAttributes(selectedNodes[i - 1]),
                graph.getNodeAttributes(selectedNodes[i])
            )
            graph.setEdgeAttribute(source, target, 'color', '#ccc');
        }

        // console.log('idx after loop ' + i);
        // console.log(0 <= i);
        // console.log(i < selectedNodes.length)
        // // deselect remaining node in list
        // if (0 <= idxToStartDeselecting && idxToStartDeselecting < selectedNodes.length) {
        //     graph.setNodeAttribute(selectedNodes[idxToStartDeselecting], 'color', 'red');
        // }

    }

    recordSelectedNode(graph, nodeNum, nodeLayer, [selectedNodes, setSelectedNodes]) {
        let currentColor = graph.getNodeAttribute(nodeNum, 'color');
        let absNodeLayer = Math.abs(nodeLayer);

        this.deselectNephewNodesOnClick(selectedNodes, absNodeLayer, graph);

        // deselecting currently selected node
        if (currentColor === 'blue') {
            console.log('current color is blue so deselecting');
            graph.setNodeAttribute(nodeNum, 'color', 'red');
            
            setSelectedNodes([
                ...selectedNodes.slice(0, absNodeLayer),
            ]);
        } else {
            console.log('current color is not blue so doing normal');
            
            graph.setNodeAttribute(nodeNum, 'color', 'blue');

            setSelectedNodes([
                ...selectedNodes.slice(0, absNodeLayer),
                nodeNum,
            ]);
        }

    
    }

    // it is only legal to select a node if a node in the previous layer is selected
    // valid path must always exist
    isLegalToSelectNode(graph, node, leftList, rightList) {    
        let selectedNodeList = null;
        if (node.x === 0) {
            return false;
        } else if (node.x > 0) {
            selectedNodeList = rightList;
        } else if (node.x < 0) {
            selectedNodeList = leftList;
        }
        console.log('node layer is ' + node.layer);
        console.log(selectedNodeList);
        console.log('length of list: ' + selectedNodeList.length);

        let idx = Math.abs(node.layer);

        if ((idx - 1) < selectedNodeList.length) {
            let prevNode = selectedNodeList[idx - 1];
            let prevNodeColor = graph.getNodeAttribute(prevNode, 'color');
            let doesEdgeExistFromPrevLayer = graph.areNeighbors(prevNode, node.nodeNum);
            
            console.log('is valid to select node? prev color: ' + prevNodeColor + ' and has edge to prev node: ' + doesEdgeExistFromPrevLayer);
            console.log('prev node is ' + prevNode);

            return prevNodeColor === 'blue' && doesEdgeExistFromPrevLayer;
        } else {
            console.log('goofy if');
            return false;
        }
    }

    async clickedNode(graph, nodeNum, [leftList, setLeftList], [rightList, setRightList]) {
        let node = graph.getNodeAttributes(nodeNum);

        if (!this.isLegalToSelectNode(graph, node, leftList, rightList)) {
            alert('invalid node to select!');
            return;
        }
    
        if (node.x < 0) {
            this.recordSelectedNode(graph, node.nodeNum, node.layer, [leftList, setLeftList] );
        } else {
            this.recordSelectedNode(graph, node.nodeNum, node.layer, [rightList, setRightList]);
        }
    
        await this.generateAdjacentNodes(graph, node.nodeNum, node.x, node.label, node.layer);
        this.colorEdgesSurroundingBlueNodes(graph, node.nodeNum);
    }
    
    async generateAdjacentNodes(graph, parentNodeNum, nodeX, label, layer) {

        // if they already have neighbours, don't regenerate neighbours
        if ((layer < 0 && graph.inNeighbors(parentNodeNum).length !== 0) ||
            (layer > 0 && graph.outNeighbors(parentNodeNum).length !== 0)) {
            console.log('skipping regeneration of nodes!');
            return;
        }

        console.log('NOT skipping regeneration of nodes!');
        console.log('layer: ' + layer);
        console.log('in neighbours length: ' + graph.inNeighbors(parentNodeNum).length + ', out length: ' + graph.outNeighbors(parentNodeNum).length);

        let xCoordAdjustment = 0;

        if (nodeX < 0) {
            xCoordAdjustment = -1;

            await axios.get(process.env.REACT_APP_BACKEND_URL + '/api/inlinks/' + label)
                .then(res => {
                    this.generateAdjacentNodesWithXCoord(graph, parentNodeNum, xCoordAdjustment, res.data);
                });
        } else if (nodeX > 0) {
            xCoordAdjustment = 1;

            await axios.get(process.env.REACT_APP_BACKEND_URL + '/api/outlinks/' + label)
                .then(res => {
                    this.generateAdjacentNodesWithXCoord(graph, parentNodeNum, xCoordAdjustment, res.data);
                });
        }

    }

    normalizeSize(arrLength) {
        let min = 5;
        let max = 15;

        let size = (0.1*arrLength)/(0.1*arrLength + 100)

        let normalization = (val) => val * (max-min) + min;

        console.log('SIZE OF NODES: ' + normalization(size));

        return normalization(size, min, max);
    }
    
    generateAdjacentNodesWithXCoord(graph, parentNodeNum, xCoordAdjustment, adjacentNodeNames) {
        let node = graph.getNodeAttributes(parentNodeNum);
    
        let adjacentNodes = [];
    
        let adjacentX = node.x + xCoordAdjustment*adjacentNodeNames.length*10;
        let adjacentY = node.y + Math.floor(adjacentNodeNames.length / 2) * 10;
        let nodeSize = this.normalizeSize(adjacentNodeNames.length);
        let layer = node.layer + xCoordAdjustment;

        for (let i = 0; i < adjacentNodeNames.length; i++){
            let newNode = newGraphNode(adjacentNodeNames[i], this.graphNodeNum++, adjacentX, adjacentY - i*10, nodeSize, 'red', layer);

            adjacentNodes.push(newNode);
        }
    
    
        for (let i = 0; i < adjacentNodes.length; i++) {
            graph.updateNode(adjacentNodes[i].nodeNum, attr => adjacentNodes[i]);

            // edge must be directed from left node to right node
            let [source, target] = this.getSourceAndTargetNodeNumOfEdge(node, adjacentNodes[i]);
            graph.updateEdge(source, target, attr => { 
                return {
                    color: attr.color ? attr.color : 'grey'
                }
            });
        }
    }

    getSourceAndTargetNodeNumOfEdge(node1, node2) {
        let source = node1.x < node2.x ? node1.nodeNum : node2.nodeNum;
        let target = node1.x > node2.x ? node1.nodeNum : node2.nodeNum;

        return [source, target];
    }
    
    colorEdgesSurroundingBlueNodes(graph, nodeKey) {
        graph.filterEdges(nodeKey, (e, _, source, target, sourceAttributes, targetAttributes) => {
            return (source === nodeKey && targetAttributes.color === 'blue') ||
                (target === nodeKey && sourceAttributes.color === 'blue');
        }).forEach((e) => graph.setEdgeAttribute(e, 'color', 'blue'));
    }
    
    getAdjacentNodeNames() {
        let randomList = ['ancient greece', 'persia', 'roman empire', 'nubia', 'mesopotamia', 'zhou dynasty', 'hittites', 'ancient egypt', 'aztecs', 'vedic civilizations', 'carthage', 'indus valley'];
    
        let random_sample = _.sample(randomList, 3);
    
        return random_sample;
        // return ['', '', ''];
    }
    

}

