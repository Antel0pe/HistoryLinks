import Graph from "graphology";
import { MultiDirectedGraph, DirectedGraph } from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import newGraphNode from "./GraphNode";
import { FC, useEffect, useState } from "react";


export default function WikipediaGraph({ rootNodeName, leftList, setLeftList, rightList, setRightList }) {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const graph = sigma.getGraph();
    let graphNodeNum = 0;


    useEffect(() => {
        console.log('startin...');
        // Create the graph
        let rootNode = newGraphNode(rootNodeName, graphNodeNum++, 0, 0, 10, 'blue');
        graph.addNode(rootNode.nodeNum, rootNode);

        setLeftList([rootNode.label]);
        setRightList([rootNode.label]);    

        console.log('updated in graph? ' + leftList);
        console.log('or dis? ' + rightList);
        
        
    }, []);
    
  
    useEffect(() => {
        // Register the events
        registerEvents({
            // node events
            clickNode: (event) => generateAdjacentNodes(event.node),
            
        });
    }, [registerEvents]);
    
    function generateAdjacentNodes(nodeNum) {
        let parentNode = graph.getNodeAttributes(nodeNum);
        let childNode = newGraphNode(graphNodeNum, graphNodeNum++, parentNode.x + 1, parentNode.y, 10, 'blue');
        graph.addNode(childNode.nodeNum, childNode);

        console.log('inserting: ' + childNode.label.toString());
        console.log('this is added to ');
        console.log('unaffected list: ' + leftList);
        // setSelectedRightNodes([...selectedRightNodes, childNode.label]);
        setRightList( // Replace the state
            [...rightList, childNode.label.toString()] // and one new item at the end
          
        );
    }
    

    return null;

    
}