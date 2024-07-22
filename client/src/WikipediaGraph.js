import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, useEffect, useState } from "react";
import { GraphAdjacentNodes } from "./GraphAdjacentNodes";
import { DirectedGraph } from "graphology";


export default function WikipediaGraph({ rootNodeName, leftList, setLeftList, rightList, setRightList, setClickedNodeNeighbours }) {
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
        
    }, []);

    async function onNodeClick(node) {
        await graphNodes.clickedNode(graph, node, [leftList, setLeftList], [rightList, setRightList]);

        console.log('clicked node neighbours are: ');

        let neighbours = [];
        if (node.x <= 0) {
            console.log('looking at inbound');
            neighbours = graph.reduceInNeighbors(node, (acc, neighbour, attr) => {
                acc.push(attr);
                return acc;
            }, []);
        } else {
            console.log('looking at outbound');

            neighbours = graph.reduceOutNeighbors(node, (acc, neighbour, attr) => {
                acc.push(attr);
                return acc;
            }, []);
        }

        setClickedNodeNeighbours(neighbours);
        console.log(graph.neighbors(node));
        console.log(neighbours);
    }
    
  
    useEffect(() => {
        // Register the events
        registerEvents({
            // node events
            clickNode: (event) => {
                onNodeClick(event.node);
            }
            
        });
    }, [registerEvents, JSON.stringify(leftList), JSON.stringify(rightList),]);

    return null;
}