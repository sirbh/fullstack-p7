import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const request = axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: token,
    },
  });
  return request.then((response) => response.data);
};

const update = (updatedBlog) => {
  const { id,...updatedLikesBlog } = updatedBlog;
  const request = axios.put(`${baseUrl}/${id}`, updatedLikesBlog, {
    headers: {
      Authorization: token,
    },
  });

  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  return request.then(data => data.response);
};


export default { getAll, create, setToken, update, remove };
