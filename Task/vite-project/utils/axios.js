// axios.js
import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:8000'; // or your backend URL
baseURL: import.meta.env.MODE === "development" ? "http://localhost:8000/api" : "/api",
axios.defaults.withCredentials = true;

export default axios;
