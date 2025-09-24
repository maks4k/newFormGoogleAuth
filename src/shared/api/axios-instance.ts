import axios from "axios";


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// export const protectedApi=axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
// })
// protectedApi.interceptors.request.use((config): any => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization=`Bearer ${token}`;
//     console.log(config);

//   }else{
//     throw new Error("cancel query Token is not found")
//   }
//   return config;
// });
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        await api.get("refresh-token");
        return api(originalRequest)
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    }
      return Promise.reject(error)
  },

);
