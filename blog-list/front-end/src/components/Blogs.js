import Blog from "./Blog";
import PropTypes from "prop-types";

const Blogs = ({ blogs, handleDelete, handleLike, user, isLoading, isError }) => {
  if(isLoading) {
    return  <div>Loading Blogs List......</div>;
  }
  if(isError) {
    return  <div>Blogs could not be loaded</div>;
  }
  const sortedBlogs = blogs.sort((a,b) => b.likes-a.likes);
  return (
    <div name="blogs">
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} handleDelete={handleDelete} handleLike={handleLike} />
      ))}
    </div>
  );
};

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired
};

export default Blogs;
