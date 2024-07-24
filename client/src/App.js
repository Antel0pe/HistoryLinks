import logo from './logo.svg';
import './App.css';
import Graph from "graphology";
import Sigma from "sigma";
import { FullScreenControl, SigmaContainer, ZoomControl, SearchControl, ControlsContainer } from "@react-sigma/core";
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
import { ListBox } from 'primereact/listbox';

function App() {
    
    const [submittedArticleTitle, setSubmittedArticleTitle] = useState(null);

    const [selectedLeftNodes, setSelectedLeftNodes] = useState([]);
    const [selectedRightNodes, setSelectedRightNodes] = useState([]);

    const [prevSelectedNeighbour, setPrevSelectedNeighbour] = useState(null);
    const [selectedNeighbour, setSelectedNeighbour] = useState(null);
    const [selectedNodeNeighbours, setSelectedNodeNeighbours] = useState([]);
    const [inboundNeighbours, setInBoundNeighbours] = useState(true);

    const sigmaSettings = ({
        enableEdgeEvents: true,
        allowInvalidContainer: true,
        itemSizesReference: "positions",
    });

    function handleSubmittedUserArticle(title) {
        console.log('submitted ' + title);
        setSubmittedArticleTitle(title);

    }

    useEffect(() => {
        console.log('different item selected!');
        console.log(JSON.stringify(selectedNeighbour));

    }, [selectedNeighbour])

    function handleNeighbourSelection(val) {
        console.log('val is ' + val);
        console.log('different item selected!');
        console.log(val);
        console.log('prev is: ' + selectedNeighbour);

        setPrevSelectedNeighbour(selectedNeighbour);
        setSelectedNeighbour(val);
    }


    return (
        <div id='page'>
            <Analytics />

            <UserInput handleSubmittedUserArticle={handleSubmittedUserArticle}></UserInput>
            
            <div id='container'>

                {submittedArticleTitle !== null && 
                    <SigmaContainer id='sigmaContainer' graph={DirectedGraph} settings={sigmaSettings}>
                        <ControlsContainer position={"top-left"}>
                            <ZoomControl />
                            <FullScreenControl />
                            <SearchControl />
                        </ControlsContainer>
                        
                        <WikipediaGraph rootNodeName={submittedArticleTitle} leftList={selectedLeftNodes} setLeftList={setSelectedLeftNodes} rightList={selectedRightNodes} setRightList={setSelectedRightNodes} setClickedNodeNeighbours={setSelectedNodeNeighbours} areNeighboursInBound={inboundNeighbours}></WikipediaGraph>

                        <CurrentPath leftList={selectedLeftNodes} rightList={selectedRightNodes} selectedNeighbour={selectedNeighbour} prevNeighbour={prevSelectedNeighbour}></CurrentPath>
                        

                    </SigmaContainer>
                }

            </div>

            <div id='listView'>  
                <h1>Neighbour List</h1>
                <button disabled={inboundNeighbours} onClick={(e) => setInBoundNeighbours(!inboundNeighbours)}>Inbound</button>
                <button disabled={!inboundNeighbours} onClick={(e) => setInBoundNeighbours(!inboundNeighbours)}>Outbound</button>
                <ListBox filter pt={{display:'none'}} value={selectedNeighbour} onChange={(e) => handleNeighbourSelection(e.value)} options={selectedNodeNeighbours} optionLabel="label" emptyMessage="click a node to see its neighbours" listStyle={{ maxHeight: '100vh' }} />
            </div>
        </div>
    );
}

export default App;




        

        