// import axios from 'axios';

// // Vite: `npm run dev` uses local API so your machine’s MongoDB matches the UI.
// // Override anytime: set VITE_API_BASE_URL in .env / .env.local (e.g. Render URL for testing prod API).
// const resolveBaseURL = () => {
//   const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
//   if (fromEnv) return fromEnv.replace(/\/$/, '');
//   if (import.meta.env.DEV) return 'http://localhost:5000/api';
//   return 'https://sk8project-backend.onrender.com/api';
// };

// const api = axios.create({
//   baseURL: resolveBaseURL(),
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await api.post('/admin/refresh');
//         const { accessToken } = res.data;
//         localStorage.setItem('accessToken', accessToken);
//         api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('user');
//         window.location.href = '/Login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: 'https://sk8project-backend.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post('/admin/refresh');
        const { accessToken } = res.data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/Login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
