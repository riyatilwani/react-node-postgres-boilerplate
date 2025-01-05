import axios from "axios";

const { protocol, hostname, port } = window.location;

const baseURL = `${protocol}//${hostname}${port ? `:${port}` : ""}/api`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

const httpService = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
};

export default httpService;
