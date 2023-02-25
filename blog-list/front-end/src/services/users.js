import axios from "axios";
const baseUrl = "/api/users";

export const getAllUsers = () => {
  return axios.get(baseUrl).then(res => res.data);
};

