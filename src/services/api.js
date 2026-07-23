import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using relative base URL so it uses Vite proxy in dev, and Flask server in prod
  timeout: 60000, // 60s timeout for processing large medical images
});

export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await api.post('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBackendStatus = async () => {
  const response = await api.get('/api/status');
  return response.data;
};

export default api;
