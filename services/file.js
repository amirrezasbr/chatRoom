import Axios from "@/constants/Axios.js";

const baseAPT = "file";

export const get = (data, slug) => Axios.get(`${baseAPT}/${slug}/${data}`);
export default {
  get,
};
