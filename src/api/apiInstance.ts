import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `https://banjjak.me:8444/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiInstance.interceptors.request.use(
  async (config) => {
    let token = null;
    const newConfig = { ...config };

    if (__DEV__) {
      token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRXhhbXBsZSIsImVtYWlsIjoiY2xhNnNoYWRlQGdtYWlsLmNvbSIsImlkIjoyLCJpYXQiOjE3NDM2NTQzODMsImV4cCI6MjA1OTAxNDM4M30.ccmESMMwwRHbrUOCUeN9uUZeNIT7X5CHnA4nUv02NNw';
    } else {
      token = await AsyncStorage.getItem('Authorization');
    }
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error) => Promise.reject(error),
);

export default apiInstance;
