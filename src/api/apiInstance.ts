import axios, { AxiosInstance } from 'axios';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `https://banjjak.me:8444/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export default apiInstance;
