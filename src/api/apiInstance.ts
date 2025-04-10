import axios, { AxiosInstance } from 'axios';
import { router } from 'expo-router';

import { getToken } from '@/utils/authStorage';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `https://banjjak.me:8445/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      router.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
