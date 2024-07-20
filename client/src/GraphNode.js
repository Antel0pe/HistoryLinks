function newGraphNode(label, nodeNum, x, y, size, color, layer){
    let node = {
        label: label,
        nodeNum: nodeNum,
        x: x,
        y: y,
        size: size,
        color: color,
        layer: layer
    }

    return node;
}

export default newGraphNode;