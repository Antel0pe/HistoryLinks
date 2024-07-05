function graphNode(label, nodeNum, x, y, size, color){
    let node = {
        label: label,
        nodeNum: nodeNum,
        x: x,
        y: y,
        size: size,
        color: color,
    }

    return node;
}

export default graphNode;