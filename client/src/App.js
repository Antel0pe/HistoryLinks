import logo from './logo.svg';
import './App.css';
import Graph from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import { createNodeImageProgram } from "@sigma/node-image";
import { FC, useEffect, useMemo, useState } from "react";
import { DirectedGraph } from "graphology"; 
import _, { random, sample } from 'underscore';
import graphNode from './GraphNode';
import { Events } from './GraphEvents';
import CurrentPath from './CurrentPath';
import UserInput from './UserInput';
import WikipediaGraph from './WikipediaGraph';
import { MultiDirectedGraph } from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";

function App() {
    const [userArticleTitle, setUserArticleTitle] = useState(null);
    const [submittedArticleTitle, setSubmittedArticleTitle] = useState(null);

    const [selectedLeftNodes, setSelectedLeftNodes] = useState([]);
    const [selectedRightNodes, setSelectedRightNodes] = useState([]);


    


    // let graph = new Graph({type: 'directed'});
    // let renderer = null;
    // let graphNodeNum = 0;
    
    // let selectedNodesLeftOfRoot = []
    // let selectedNodesRightOfRoot = []

    function setRightListHelp(l) {
        console.log('even here it blank? ');
        console.log(selectedRightNodes);
        setSelectedRightNodes([...selectedRightNodes, l]);
    }

    const sigmaSettings = ({
        enableEdgeEvents: true,
        allowInvalidContainer: true
    });

    function handleSubmittedUserArticle() {
        setSubmittedArticleTitle(userArticleTitle);
    }

    // function updateText() {
    //     let text = [...selectedNodesLeftOfRoot.slice(1)].reverse().concat(selectedNodesRightOfRoot).map((num) => {
    //         return graph.getNodeAttribute(num, 'label');
    //     }).join(' -> ');

    //     console.log('UPDATED: ' + [...selectedNodesLeftOfRoot.slice(1)]);

    //     let currentPath = document.getElementById('currentPath');
    //     currentPath.innerHTML = text;

        
    // }

    // // useEffect(() => {
    // //     console.log('USE EFFECT triggerin')
    // //     let left = [...selectedNodesLeftOfRoot].reverse().map((n) => graph.getNodeAttribute(n, 'label'));
    // //     let right = selectedNodesRightOfRoot.map((n) => graph.getNodeAttribute(n, 'label'));
    // //     console.log(left + ' ' + right)
    // // }, [selectedNodesLeftOfRoot.join(), selectedNodesRightOfRoot.join()]);

    // function createRootNode() {
    //     let rootArticle = document.getElementById('userInputArticle');

    //     let rootNode = graphNode(rootArticle.value, graphNodeNum++, 0, 0, 10, 'blue');
    //     graph.addNode(rootNode.nodeNum, rootNode);

    //     selectedNodesLeftOfRoot = [rootNode.nodeNum];
    //     selectedNodesRightOfRoot = [rootNode.nodeNum];

    //     // Create the sigma
    //     let container = document.getElementById('graphView');
    //     renderer = new Sigma(graph, container);
    //     graphEvents(renderer);

    //     generateAdjacentNodes(rootNode.nodeNum, rootNode.x, rootNode.y, false, 1);
    //     generateAdjacentNodes(rootNode.nodeNum, rootNode.x, rootNode.y, true, -1);
        
    // }

    // // when a user has selected a path on nodes 2, 4, 6 we highlight those nodes
    // // when a user then clicks node 3 which is on the same level as node 2, we want to deselect 2, 4, 6
    // function deselectNephewNodesOnClick(selectedNodes, idxToStartDeselecting) {
    //     if (idxToStartDeselecting > selectedNodes.length) {
    //         return selectedNodes;
    //     }

    //     console.log('deselecting nephew nodes');
    //     console.log(selectedNodes);
    //     console.log(idxToStartDeselecting);
    //     let i = null;
    //     for (i = selectedNodes.length - 1; i >= idxToStartDeselecting;  i--){
    //         console.log('deselecting node @ idx ' + i);
    //         console.log(i > idxToStartDeselecting);

    //         // deselect node
    //         graph.setNodeAttribute(selectedNodes[i], 'color', 'red');

    //         // deselect edge to next node
    //         graph.setEdgeAttribute(selectedNodes[i - 1], selectedNodes[i], 'color', '#ccc');
    //     }

    //     // console.log('idx after loop ' + i);
    //     // console.log(0 <= i);
    //     // console.log(i < selectedNodes.length)
    //     // // deselect remaining node in list
    //     // if (0 <= idxToStartDeselecting && idxToStartDeselecting < selectedNodes.length) {
    //     //     graph.setNodeAttribute(selectedNodes[idxToStartDeselecting], 'color', 'red');
    //     // }

    // }

    // function recordSelectedNode(nodeNum, xCoord) {
    //     // remove all elements from insertion location all the way to the end of the array
    //     // then insert the node num in the correct location
    //     if (xCoord > 0) {
    //         deselectNephewNodesOnClick(selectedNodesRightOfRoot, xCoord);
    //         selectedNodesRightOfRoot = selectedNodesRightOfRoot.toSpliced(xCoord);
    //         selectedNodesRightOfRoot[xCoord] = nodeNum;
    //     } else if (xCoord < 0) {
    //         deselectNephewNodesOnClick(selectedNodesLeftOfRoot, Math.abs(xCoord));
    //         selectedNodesLeftOfRoot = selectedNodesLeftOfRoot.toSpliced(Math.abs(xCoord));
    //         selectedNodesLeftOfRoot[Math.abs(xCoord)] = nodeNum;
    //     }

    //     console.log([...selectedNodesLeftOfRoot].reverse() + ' , ' + selectedNodesRightOfRoot);
    // }

    // // it is only legal to select a node if a node in the previous layer is selected
    // // valid path must always exist
    // function isLegalToSelectNode(xVal, nodeNum) {    
    //     let selectedNodeList = null;
    //     if (xVal === 0) {
    //         return false;
    //     } else if (xVal > 0) {
    //         selectedNodeList = selectedNodesRightOfRoot;
    //     } else if (xVal < 0) {
    //         selectedNodeList = selectedNodesLeftOfRoot;
    //     }
    //     console.log('xCoord is ' + xVal);
    //     console.log('length of list: ' + selectedNodeList.length);

    //     let idx = Math.abs(xVal);

    //     if ((idx - 1) < selectedNodeList.length) {
    //         let prevNode = selectedNodeList[idx - 1];
    //         let prevNodeColor = graph.getNodeAttribute(prevNode, 'color');
    //         let doesEdgeExistFromPrevLayer = graph.hasEdge(prevNode, nodeNum);
            
    //         console.log('is valid to select node? prev color: ' + prevNodeColor + ' and has edge to prev node: ' + doesEdgeExistFromPrevLayer);
    //         console.log('prev node is ' + prevNode);

    //         return prevNodeColor === 'blue' && doesEdgeExistFromPrevLayer;
    //     } else {
    //         console.log('goofy if');
    //         return false;
    //     }
    // }

    // function graphEvents(renderer) {
    //     renderer.on('clickNode', (event) => {
    //         let node = event.node;
    //         let attr = {
    //             num: graph.getNodeAttribute(node, 'nodeNum'),
    //             x: graph.getNodeAttribute(node, 'x'),
    //             y: graph.getNodeAttribute(node, 'y'),
    //         }

    //         if (!isLegalToSelectNode(attr.x, attr.num)) {
    //             alert('invalid node to select!');
    //             return;
    //         }

    //         graph.setNodeAttribute(node, 'color', 'blue');

            
    //         let areRightNodesPresent = null;
    //         let adjacentXCoord = null;

    //         recordSelectedNode(attr.num, attr.x);

    //         if (attr.x > 0) {
    //             areRightNodesPresent = false;
    //             adjacentXCoord = attr.x + 1;
    //         } else if (attr.x < 0) {
    //             areRightNodesPresent = true;
    //             adjacentXCoord = attr.x - 1;
    //         }

    //         generateAdjacentNodes(attr.num, attr.x, attr.y, areRightNodesPresent, adjacentXCoord);
    //         colorSurroundingBlueNodes(attr.num);
    //         updateText();
    //     });
    // }

    // function generateAdjacentNodes(parentNodeNum, parentNodeX, parentNodeY, areRightNodesPresent, adjacentXCoord) {
    //     let xCoordAdjustment = 0;
    //     if (adjacentXCoord < 0) {
    //         xCoordAdjustment = -1;
    //     } else if (adjacentXCoord > 0) {
    //         xCoordAdjustment = 1;
    //     }

    //     let adjacentNodes = [];
    //     let adjacentNodeNames = getAdjacentNodeNames();

    //     let adjacentX = parentNodeX + xCoordAdjustment;
    //     let adjacentY = parentNodeY + 1;
    //     for (let i = 0; i < adjacentNodeNames.length; i++){
    //         adjacentNodes.push(graphNode(adjacentNodeNames[i], graphNodeNum++, adjacentX, adjacentY - i, 10, 'red'));
    //     }


    //     for (let i = 0; i < adjacentNodes.length; i++) {
    //         graph.addNode(adjacentNodes[i].nodeNum, adjacentNodes[i]);
    //         graph.addEdge(parentNodeNum, adjacentNodes[i].nodeNum);
    //     }
    // }

    // // Assumes nodeKey is already colored blue
    // function colorSurroundingBlueNodes(nodeKey) {
    //     graph.filterEdges(nodeKey, (e, _, source, target, sourceAttributes, targetAttributes) => {
    //         return sourceAttributes.color === 'blue' && targetAttributes.color === 'blue'
    //     }).forEach((e) => graph.setEdgeAttribute(e, 'color', 'blue'));
    // }

    // function getAdjacentNodeNames() {
    //     let randomList = ['ancient greece', 'persia', 'roman empire', 'nubia', 'mesopotamia', 'zhou dynasty', 'hittites', 'ancient egypt', 'aztecs', 'vedic civilizations', 'carthage', 'indus valley'];

    //     let random_sample = _.sample(randomList, 3);

    //     return random_sample;
    // }



    return (
        <div id='container'>
            {/* <div id='instructions'>
                <h3 id='heading'>HistoryLinks</h3>
                <p>Explore how a wikipedia page about history is linked to/by other history articles on wikipedia</p>
                <input id='userInputArticle' placeholder='Enter the name of a wikipedia history article' size={40}></input>
                <button id='button' onClick={createRootNode}>Explore!</button>
            </div> */}
            <UserInput setUserArticleTitle={setUserArticleTitle} handleSubmittedUserArticle={handleSubmittedUserArticle}></UserInput>
            
            {/* {submittedArticleTitle !== null &&
                <div id='graphView'>
                    <SigmaContainer graph={MultiDirectedGraph} settings={sigmaSettings}>
                        <WikipediaGraph rootNodeName={submittedArticleTitle}></WikipediaGraph>
                    </SigmaContainer>
                </div>
            } */}

            {/* <SigmaContainer id='graphView' graph={DirectedGraph} settings={sigmaSettings}>
                <WikipediaGraph rootNodeName={submittedArticleTitle}></WikipediaGraph>
            </SigmaContainer> */}
            
            {/* <div id='graphView'>
                <SigmaContainer graph={MultiDirectedGraph} settings={sigmaSettings}>
                        <WikipediaGraph rootNodeName={submittedArticleTitle}></WikipediaGraph>
                </SigmaContainer>
            </div> */}

            {submittedArticleTitle !== null && 
                <SigmaContainer id='graphView' graph={DirectedGraph} settings={sigmaSettings}>
                    <WikipediaGraph rootNodeName={submittedArticleTitle} leftList={selectedLeftNodes} setLeftList={setSelectedLeftNodes} rightList={selectedRightNodes} setRightList={setSelectedRightNodes}></WikipediaGraph>
                </SigmaContainer>
            }

            {selectedLeftNodes.length !== 0 && selectedRightNodes.length !== 0 &&
                <CurrentPath leftList={selectedLeftNodes} rightList={selectedRightNodes} ></CurrentPath>
            }

            
            {/* <SigmaContainer graph={graph} settings={sigmaSettings} id='graphView'>
            </SigmaContainer>
            <CurrentPath
                leftList={selectedNodesLeftOfRoot}
                rightList={selectedNodesRightOfRoot}
                graph={graph}>
                
            </CurrentPath>
            <text id='currentPath'></text> */}
        </div>
    );
}

export default App;
