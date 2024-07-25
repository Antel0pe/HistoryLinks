import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, useEffect, useState } from "react";
import { GraphAdjacentNodes } from "./GraphAdjacentNodes";
import { DirectedGraph } from "graphology";


export default function WikipediaGraph({ rootNodeName, leftList, setLeftList, rightList, setRightList, setClickedNodeNeighbours, areNeighboursInBound }) {

    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    let graph = sigma.getGraph();

    let graphNodes = new GraphAdjacentNodes()
    const [lastClickedNode, setLastClickedNode] = useState(0);


    // let graphNodes = new GraphAdjacentNodes();

    useEffect(() => {
        // Create the graph
        console.log('creating on mount');
        // let rootNode = newGraphNode(rootNodeName, graphNodeNum++, 0, 0, 10, 'blue');
        // graph.addNode(rootNo(de.nodeNum, rootNode);
        sigma.setGraph(new DirectedGraph());
        graph = sigma.getGraph();
        graphNodes.reset();

        setLeftList([rootNodeName]);
        setRightList([rootNodeName]);

        graphNodes.createRootNode(graph, rootNodeName, setLeftList, setRightList);
        
    }, [rootNodeName]);

    useEffect(() => {
        console.log('neighbours in bound changed, now: ' + areNeighboursInBound);
        
        let neighbours = collectNodeNeighbours();
        setClickedNodeNeighbours(neighbours);
    }, [areNeighboursInBound])

    useEffect(() => {
        console.log('last clicked node changed');

        let neighbours = collectNodeNeighbours();
        setClickedNodeNeighbours(neighbours);
    }, [lastClickedNode])

    function collectNodeNeighbours() {
        let neighbours = [];
        console.log('clicked node neighbours are: ');      

        // if (areNeighboursInBound) {
        //     console.log('looking at inbound');
        //     neighbours = graph.reduceInNeighbors(lastClickedNode, (acc, neighbour, attr) => {
        //         acc.push(attr);
        //         return acc;
        //     }, []);
        // } else {
        //     console.log('looking at outbound');

        //     neighbours = graph.reduceOutNeighbors(lastClickedNode, (acc, neighbour, attr) => {
        //         acc.push(attr);
        //         return acc;
        //     }, []);
        // }

        console.log(neighbours);

        return neighbours;
    }

    async function onNodeClick(node) {
        // remove highlight if highlighted
        graph.removeNodeAttribute(node, "highlighted");

        await graphNodes.clickedNode(graph, node, [leftList, setLeftList], [rightList, setRightList]);  
        setLastClickedNode(node);
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