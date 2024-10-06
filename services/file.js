import Axios from "@/constants/Axios.js";

const baseAPT = "file";

export const get = (data, slug) =>
  Axios.get(`${baseAPT}/${slug}/${data}`, {
    responseType: "blob",
  });
export const upload = (data) =>
  Axios.post(`${baseAPT}/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default {
  get,
  upload,
};
