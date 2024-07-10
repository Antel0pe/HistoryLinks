import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, useEffect, useState } from "react";
import { GraphAdjacentNodes } from "./GraphAdjacentNodes";
import { DirectedGraph } from "graphology";



// function generateAdjacentNodes(graph, nodeNum, graphNodeNum, selectedRightNodes, setSelectedRightNodes) {
//     let parentNode = graph.getNodeAttributes(nodeNum);
//     let childNode = newGraphNode(graphNodeNum, graphNodeNum, parentNode.x + 1, parentNode.y, 10, 'blue');
//     graph.addNode(childNode.nodeNum, childNode);


//     setSelectedRightNodes([...selectedRightNodes, childNode.label]);
// }
// let graphNodes;
// function createGraphNodes() {
//     if (!graphNodes){
//         graphNodes = new GraphAdjacentNodes();
//     }
// }

// const graphNodes = new GraphAdjacentNodes();

export default function WikipediaGraph({ rootNodeName, leftList, setLeftList, rightList, setRightList }) {
    // createGraphNodes();

    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    let graph = sigma.getGraph();

    const [graphNodes, setGraphNodes] = useState(new GraphAdjacentNodes());
    // let graphNodes = new GraphAdjacentNodes();

    useEffect(() => {
        // Create the graph
        console.log('creating on mount');
        // let rootNode = newGraphNode(rootNodeName, graphNodeNum++, 0, 0, 10, 'blue');
        // graph.addNode(rootNode.nodeNum, rootNode);
        sigma.setGraph(new DirectedGraph());
        graph = sigma.getGraph();
        graphNodes.resetGraphNodeNum();

        setLeftList([rootNodeName]);
        setRightList([rootNodeName]);  

        graphNodes.createRootNode(graph, rootNodeName, setLeftList, setRightList);
        // graph = sigma.getGraph();
        
        // setGraphNodes(new GraphAdjacentNodes(), () => {
        //     graphNodes.createRootNode(graph, rootNodeName, setLeftList, setRightList);
        // });
        
        

        // let n = graphNode(rootNodeName, graphNodeNum, 0, 0, 10, 'blue');
        // graph.addNode(graphNodeNum++, n);

        
    }, []);
    
  
    useEffect(() => {
        // Register the events
        registerEvents({
            // node events
            clickNode: (event) => {
                graphNodes.clickedNode(graph, event.node, [leftList, setLeftList], [rightList, setRightList]);
            }
            
        });
    }, [registerEvents, JSON.stringify(leftList), JSON.stringify(rightList),]);
    
    function incrementList() {
        setLeftList([...leftList, setLeftList.length + 1]);
        setRightList([...rightList, setRightList.length + 1]);
    }

    // return <>
    //     <button onClick={() => incrementList()}>Click dis</button>
    
    // </>
    return null;
}