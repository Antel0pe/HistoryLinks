import axios from "axios";

export const getInLinks = async (title) => {
    let path = process.env.REACT_APP_BACKEND_URL + '/api/inlinks/' + title;
    return axios.get(path);
}

export const getOutLinks = async (title) => {
    let path = process.env.REACT_APP_BACKEND_URL + '/api/outlinks/' + title;
    return axios.get(path);
}
