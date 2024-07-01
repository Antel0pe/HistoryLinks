import logo from './logo.svg';
import './App.css';
import Graph from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import { createNodeImageProgram } from "@sigma/node-image";
import { FC, useEffect, useMemo, useState } from "react";
import { DirectedGraph } from "graphology"; 

function App() {
    let graph = null;
    let renderer = null;

    const sigmaSettings = useMemo(
        () => ({
          nodeProgramClasses: {
            image: createNodeImageProgram({
              size: { mode: "force", value: 256 },
            }),
          },
            defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }),
        [],
      );

    function createRootNode() {
        let rootArticle = document.getElementById('userInputArticle');
        console.log('root: ' + rootArticle.value);

        graph = new Graph();
        graph.addNode("n1", { x: 0, y: 0, size: 10, color: 'blue', label: rootArticle.value });

        // Create the sigma
        let container = document.getElementById('graphView');
        const renderer = new Sigma(graph, container);
        
    }



    return (
        <div id='container'>
            <div id='instructions'>
                <h3 id='heading'>Enter a Wikipedia history article!</h3>
                <input id='userInputArticle'></input>
                <button id='button' onClick={createRootNode}>Explore!</button>
            </div>
            <div id='graphView'>

            </div>
        </div>
    );
}

export default App;
