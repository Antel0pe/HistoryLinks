import { useEffect, useState } from "react"
import { isNull } from "underscore";

export default function CurrentPath({ leftList, rightList, graph }) {
    let [path, setPath] = useState('');

    useEffect(() => {
        console.log('USE EFFECT triggerin')
        let left = [...leftList].reverse().map((n) => graph.getNodeAttribute(n, 'label'));
        let right = rightList.map((n) => graph.getNodeAttribute(n, 'label'));
        console.log(left + ' ' + right)

        setPath(left + ' ' + right)

    }, [leftList.join(), rightList.join()]);

    if (graph !== null && leftList !== null && rightList !== null) {
        return <text>{path}</text>
    }

}
