import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.codenation.dev',
});

export default api;
