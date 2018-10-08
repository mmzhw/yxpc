import axios from 'axios';
import { baseURL } from './url';

let fetcher = axios.create({
    method: 'post',
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

fetcher.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return console.error(error);
});

export default fetcher.post;
