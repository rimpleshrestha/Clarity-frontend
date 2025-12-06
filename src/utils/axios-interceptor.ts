import axios, { AxiosError, type AxiosResponse } from "axios";
const baseURL = "http://localhost:4000/api/v1";
const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access-token");
    if (accessToken && config.headers) {
      config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Something went wrong", error.cause);
    Promise.reject(error);
  }
);

const getNewAccessToken = async () => {
  return axios.get(`${baseURL}/refresh-token`, {
    withCredentials: true,
  });
};
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config;
    if (error.response?.status == 403 && config) {
      console.log("Initate the refresh token recycling because token expired");
      const new_access_token = (await getNewAccessToken()) ?? "Something Here";
      localStorage.setItem(
        "access-token",
        await new_access_token.data.access_token
      );
      if (new_access_token) {
        config.headers.Authorization = "Bearer " + new_access_token;
      }
      //   Retry the Previous API Call
      return api.request(config);
    }
    if (error.code === "ERR_CANCELED") {
      // Promise rejected because of abott controller
      console.log("Request aborted");
      return Promise.reject(error);
    }
    if (error.response?.status == 401) {
      console.log("Unauthorized request access");
    }
    return Promise.reject(error);
  }
);

export default api;
