import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, handleDelete, handleLike, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <p>
        <Link to={`blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        <button
          name="view"
          onClick={() => {
            setShowDetails((prev) => !prev);
          }}
        >
          {showDetails ? "hide" : "view"}
        </button>
      </p>
      {showDetails && (
        <>
          <a href={blog.url}>{blog.url}</a>
          <p>
            {blog.likes}
            <button
              name="like"
              onClick={() => {
                handleLike(blog);
              }}
            >
              Like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username ? (
            <button
              name="delete"
              onClick={() => {
                handleDelete(blog.id, blog.title, blog.author);
              }}
            >
              remove
            </button>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
