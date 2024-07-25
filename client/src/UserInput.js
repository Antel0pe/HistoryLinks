import { useState, useEffect } from "react";
import { prefixSearch } from "./apis/wikipedia";
import { Autocomplete, TextField } from "@mui/material";
 

export default function UserInput({ handleSubmittedUserArticle }) {
    const [suggestedArticleTitles, setSuggestedArticleTitles] = useState(['Appian Way']);

    function updateAutocompleteOptions(e){
        let userArticleTitle = e.target.value;

        prefixSearch(userArticleTitle, 10)
            .then((res) => {
                if (!res.data.error) {
                    setSuggestedArticleTitles(res.data.query.prefixsearch.map((t) => t.title));    
                }
            })
        
    }


    return <>
        <div id='instructions'>
            <h3 id='heading'>HistoryLinks</h3>
            <p>Explore how a wikipedia page about history is linked to/by other history articles on wikipedia</p>
            <Autocomplete
                disablePortal
                id='userInputArticle'
                options={suggestedArticleTitles}
                onInputChange={(e) => updateAutocompleteOptions(e)}
                onChange={(e) => handleSubmittedUserArticle(e)}
                isOptionEqualToValue={(option, value) => true}
                sx={{ width: 300, backgroundColor: "white",  margin: "auto" }}
                renderInput={(params) => <TextField {...params} label="Enter a Wikipedia article title" />}
                />
        </div>
    </>
}