import Axios from "@/constants/Axios.js";

const baseAPT = "auth";

export const login = (data) => Axios.post(`${baseAPT}/login`, data);
export const register = (data) => Axios.post(`${baseAPT}/register`, data);

export default {
  login,
  register,
};
