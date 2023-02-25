import { useState } from "react";
import blogService from "./services/blogs";
import authServices from "./services/auth";
import Loginform from "./components/Loginform";
import { getAllUsers } from "./services/users";
import Blogs from "./components/Blogs";
import Blogform from "./components/Blogform";
import Togglable from "./components/Togglable";
import { useMutation, useQueryClient } from "react-query";
import { useStoredUser, useUserDispatch } from "./contexts/authContext";
import {
  useNotification,
  useNotificationDispatch,
} from "./contexts/notificationContext";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import Users from "./components/Users";
import { useQuery } from "react-query";
import User from "./components/User";
import SingleBlogView from "./components/SingleBlogView";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const message = useNotification();
  const dispatchNotification = useNotificationDispatch();

  const queryClient = useQueryClient();
  const user = useStoredUser();
  const dispatchUser = useUserDispatch();

  const users = useQuery("users", getAllUsers);
  const blogs = useQuery("blogs", blogService.getAll);

  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");
  let singleUser;
  if (!users.isLoading) {
    singleUser = userMatch
      ? users.data.find((user) => user.id === userMatch.params.id)
      : null;
  }
  let singleBlog;
  if (!blogs.isLoading) {
    singleBlog = blogMatch
      ? blogs.data.find((blog) => blog.id === blogMatch.params.id)
      : null;
  }


  const updateMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });

  const deleteMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });

  const newBlogMutation = useMutation(blogService.create,{
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
      queryClient.invalidateQueries("users");
    }
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await authServices.login(username, password);
      // setUser(user);
      dispatchUser({
        type: "SET_USER",
        payload: user,
      });
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setPassword("");
      setUsername("");
    } catch {
      dispatchNotification({ type: "SET", payload: "Wrong credentials" });
      setTimeout(() => {
        dispatchNotification({ type: "SET", payload: null });
      }, 5000);
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem("user");
    dispatchUser({
      type: "SET_USER",
      payload: undefined,
    });
    blogService.setToken("");
  };

  const createBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog);
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };

    updateMutation.mutate(updatedBlog);
  };
  return (
    <div>
      {message && <p>{message}</p>}
      {!user && (
        <Loginform
          password={password}
          username={username}
          handleLogin={handleLogin}
          setPassword={(p) => setPassword(p)}
          setUsername={(u) => setUsername(u)}
        />
      )}
      {user && (
        <>
          <h2>Blogs</h2>
          <p>
            <Link to="/">blogs</Link>
            <Link to="/users">users</Link>
            {`${user.name} is logged in`}
            <button name="logout" onClick={handleLogout}>
              logout
            </button>
          </p>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Blogs
                    blogs={blogs.data ? blogs.data : []}
                    user={user}
                    handleDelete={handleDelete}
                    handleLike={handleLike}
                    isLoading={blogs.isLoading}
                    isError={blogs.isError}
                  />
                  <Togglable buttonLabel={"create"}>
                    <Blogform createBlog={createBlog} />
                  </Togglable>
                </>
              }
            />
            <Route
              path="/users"
              element={
                <Users
                  isLoading={users.isLoading}
                  isError={users.isError}
                  users={users.data}
                />
              }
            />
            <Route
              path="/users/:id"
              element={<User user={singleUser} isLoading={users.isLoading} />}
            />
            <Route
              path="/blogs/:id"
              element={
                <SingleBlogView blog={singleBlog} isLoading={blogs.isLoading} likeHandler={handleLike} />
              }
            />
            {/* <Route path="/" element={<Home />} /> */}
          </Routes>
          {/* <Blogs
            blogs={data?data:[]}
            user={user}
            handleDelete={handleDelete}
            handleLike={handleLike}
            isLoading={isLoading}
            isError={isError}
          />
          <Togglable buttonLabel={"create"}>
            <Blogform createBlog={createBlog} />
          </Togglable> */}
        </>
      )}
    </div>
  );
};

export default App;
