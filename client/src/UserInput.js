import { useState } from "react";


export default function UserInput({handleSubmittedUserArticle}) {
    const [userArticleTitle, setUserArticleTitle] = useState(null);

    function handleChange(e) {
        setUserArticleTitle(e.target.value);
    }



    return <>
        <div id='instructions'>
            <h3 id='heading'>HistoryLinks</h3>
            <p>Explore how a wikipedia page about history is linked to/by other history articles on wikipedia</p>
            <input id='userInputArticle' onChange={(e) => handleChange(e)} placeholder='Enter the name of a wikipedia history article' size={40}></input>
            <button id='button' onClick={() => handleSubmittedUserArticle(userArticleTitle)}>Explore!</button>
        </div>
    </>
}