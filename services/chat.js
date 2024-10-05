import Axios from "@/constants/Axios.js";

const baseAPT = "chat";

export const create = (data) => Axios.post(`${baseAPT}/create`, data);
export const list = (data) => Axios.get(`${baseAPT}/list`, data);
export const history = (slug, data) =>
  Axios.get(`${baseAPT}/history/${slug}`, data);

export default {
  create,
  list,
  history,
};
