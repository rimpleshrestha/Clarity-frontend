import axios, { AxiosError } from "axios";

const baseURL = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getNewAccessToken = async () => {
  return axios.get(`${baseURL}/refresh-token`, {
    withCredentials: true, // MUST BE HERE TOO
  });
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config;

    if (error.response?.status === 403 && config) {
      console.log("Token expired → refreshing…");

      const res = await getNewAccessToken();
      const newToken = res.data.data.access_token;

      localStorage.setItem("access_token", newToken);

      // FIXED
      config.headers.Authorization = `Bearer ${newToken}`;

      return api.request(config); // retry the request
    }

    return Promise.reject(error);
  }
);

export default api;
