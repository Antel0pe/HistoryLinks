import { useEffect, useState } from "react";
import { isNull } from "underscore";
import { FullScreenControl, SigmaContainer, ZoomControl, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";

export default function CurrentPath({ leftList, rightList }) {
    const sigma = useSigma();
    const graph = sigma.getGraph();

    const [currentPathText, setCurrentPathText] = useState('');

    useEffect(() => {
        // console.log('current lists are ');
        // console.log(leftList);
        // console.log(rightList);
        // console.log('graph deets');
        // console.log('num nodes ' + graph.order);
        // console.log('num edges ' + graph.size);
        let text = [...leftList].slice(1).reverse().concat(rightList)
            .map((num) => graph.getNodeAttribute(num, 'label')).join(',');
        setCurrentPathText(text);

    }, [leftList, rightList])

    return <>
        <p>Current Path:</p>
        <p>{currentPathText}</p>
    </>


    // let [path, setPath] = useState('');

    // useEffect(() => {
    //     console.log('USE EFFECT triggerin')
    //     let left = [...leftList].reverse().map((n) => graph.getNodeAttribute(n, 'label'));
    //     let right = rightList.map((n) => graph.getNodeAttribute(n, 'label'));
    //     console.log(left + ' ' + right)

    //     setPath(left + ' ' + right)

    // }, [leftList.join(), rightList.join()]);

    // if (graph !== null && leftList !== null && rightList !== null) {
    //     return <text>{path}</text>
    // }

}
