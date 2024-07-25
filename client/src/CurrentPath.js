import { useEffect, useState } from "react";
import { isNull } from "underscore";
import { FullScreenControl, SigmaContainer, ZoomControl, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";

export default function CurrentPath({ leftList, rightList, selectedNeighbour, prevNeighbour }) {
    const sigma = useSigma();
    const graph = sigma.getGraph();

    const [currentPathText, setCurrentPathText] = useState('');

    useEffect(() => {
        let text = [...leftList].slice(1).reverse().concat(rightList)
            .map((num) => graph.getNodeAttribute(num, 'label')).join(', ');
        setCurrentPathText(text);

    }, [leftList, rightList])

    useEffect(() => {
        if (prevNeighbour !== null && graph.hasNode(prevNeighbour.nodeNum)) {
            graph.removeNodeAttribute(prevNeighbour.nodeNum, "highlighted");
        }
        
        if (selectedNeighbour !== null && graph.hasNode(selectedNeighbour.nodeNum)) {
            graph.setNodeAttribute(selectedNeighbour.nodeNum, "highlighted", true);
        }
        

    }, [selectedNeighbour])

    return <>
        <div id='currentPath'>
            <p>Current Path:</p>
            <p>{currentPathText}</p>
        </div>
    </>

}
