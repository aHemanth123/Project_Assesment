// axios.js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // or your backend URL
axios.defaults.withCredentials = true;

export default axios;
