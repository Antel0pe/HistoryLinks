import axios from "axios";

export const prefixSearch = async (title, limit) => {
    let path = 'https://en.wikipedia.org/w/api.php';
    let params = {
        origin: '*',
        action: 'query',
        format: 'json',
        list: 'prefixsearch',
        pssearch: encodeURIComponent(title),
        pslimit: limit,
    }

    let config = {
        params: params,
    }

    return axios.get(path, config);
}

