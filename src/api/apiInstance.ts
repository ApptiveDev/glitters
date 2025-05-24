import { queryClient } from 'app/_layout';
import axios, { AxiosInstance } from 'axios';
import { router } from 'expo-router';

import { getToken, removeToken } from '@/utils/authStorage';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `https://banjjak.me:8443/api/`,
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
  (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      if (queryClient) {
        queryClient.clear();
      }
      router.replace('/login');
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
