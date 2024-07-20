import logo from './logo.svg';
import './App.css';
import Graph from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import { createNodeImageProgram } from "@sigma/node-image";
import { FC, useEffect, useMemo, useState } from "react";
import { DirectedGraph } from "graphology"; 
import _, { random, sample } from 'underscore';
import graphNode from './GraphNode';
import { Events } from './GraphAdjacentNodes';
import CurrentPath from './CurrentPath';
import UserInput from './UserInput';
import WikipediaGraph from './WikipediaGraph';
import { MultiDirectedGraph } from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react"

function App() {
    
    const [submittedArticleTitle, setSubmittedArticleTitle] = useState(null);

    const [selectedLeftNodes, setSelectedLeftNodes] = useState([]);
    const [selectedRightNodes, setSelectedRightNodes] = useState([]);

    const sigmaSettings = ({
        enableEdgeEvents: true,
        allowInvalidContainer: true,
        itemSizesReference: "positions",
    });

    function handleSubmittedUserArticle(title) {
        console.log('submitted ' + title);
        setSubmittedArticleTitle(title);

    }




    return (
        <div id='container'>
            <Analytics />

            <UserInput handleSubmittedUserArticle={handleSubmittedUserArticle}></UserInput>

            {submittedArticleTitle !== null && 
                <SigmaContainer id='sigmaContainer' graph={DirectedGraph} settings={sigmaSettings}>
                    
                    <WikipediaGraph rootNodeName={submittedArticleTitle} leftList={selectedLeftNodes} setLeftList={setSelectedLeftNodes} rightList={selectedRightNodes} setRightList={setSelectedRightNodes}></WikipediaGraph>

                    <CurrentPath leftList={selectedLeftNodes} rightList={selectedRightNodes} ></CurrentPath>
                    

                </SigmaContainer>
            }


            

        </div>
    );
}

export default App;
