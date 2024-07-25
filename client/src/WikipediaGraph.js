import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, useEffect, useState } from "react";
import { GraphAdjacentNodes } from "./GraphAdjacentNodes";
import { DirectedGraph } from "graphology";


export default function WikipediaGraph({ rootNodeName, leftList, setLeftList, rightList, setRightList, setClickedNodeNeighbours, areNeighboursInBound }) {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    let graph = sigma.getGraph();

    const [graphNodes, setGraphNodes] = useState(new GraphAdjacentNodes());
    const [lastClickedNode, setLastClickedNode] = useState(0);

    useEffect(() => {
        graph.clear();
        graphNodes.resetGraphNodeNum();

        setLeftList([rootNodeName]);
        setRightList([rootNodeName]);

        graphNodes.createRootNode(graph, rootNodeName, setLeftList, setRightList);
    }, [rootNodeName])

    useEffect(() => {
        let neighbours = collectNodeNeighbours();
        setClickedNodeNeighbours(neighbours);
    }, [areNeighboursInBound])

    useEffect(() => {
        let neighbours = collectNodeNeighbours();
        setClickedNodeNeighbours(neighbours);
    }, [lastClickedNode])

    function collectNodeNeighbours() {
        let neighbours = [];

        if (areNeighboursInBound) {
            neighbours = graph.reduceInNeighbors(lastClickedNode, (acc, neighbour, attr) => {
                acc.push(attr);
                return acc;
            }, []);
        } else {
            neighbours = graph.reduceOutNeighbors(lastClickedNode, (acc, neighbour, attr) => {
                acc.push(attr);
                return acc;
            }, []);
        }

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