import axios from "axios";

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
  });

  api.interceptors.request.use(
    function (config) {
      return {
        ...config,
        withCredentials: true,
      };
    },
    function (error) {
      return Promise.reject(error);
    }
  );




export default api;
