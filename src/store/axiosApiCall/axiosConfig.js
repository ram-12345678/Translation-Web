import axios from 'axios';

const instance = axios.create({
  baseURL: ' https://98.70.11.251:5000', // Replace with your API base URL
  timeout: 10000, // Timeout in milliseconds (10 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;