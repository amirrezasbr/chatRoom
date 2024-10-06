import constant from "./globalConstant";
import Axios from "axios";

const farafundAxios = Axios.create({
  baseURL: constant.mainUrl,
  timeout: 6000,
});
farafundAxios.interceptors.request.use(
  function (config) {
    const storageToken = localStorage?.getItem("token");

    if (storageToken && !config?.headers?.Authorization) {
      // let parsedToken = JSON.parse(storageToken);
      config.headers.Authorization = `Bearer ${storageToken}`;
    } else if (!storageToken && config?.headers?.Authorization) {
      config.headers.Authorization = "";
    }

    return config;
  },
  function (error) {
    console.log("test1", error);
    return Promise.reject(error);
  }
);
farafundAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("test2", error);
    return Promise.reject(error);
  }
);
export default farafundAxios;
