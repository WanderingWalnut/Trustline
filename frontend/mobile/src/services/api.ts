import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api', // point to your Django backend later
  timeout: 10000,
});

export async function ping() {
  const { data } = await api.get('/health/');
  return data;
}
