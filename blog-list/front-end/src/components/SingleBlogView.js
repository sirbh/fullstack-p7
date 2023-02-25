const SingleBlogView = ({ blog, isLoading, likeHandler }) => {
  if(isLoading){
    return <div>Loading...</div>;
  }

  return <>
    <h1>{blog.title}</h1>
    <a href={blog.url}>{blog.url}</a>
    <p>{`${blog.likes} likes`}<button onClick={() => {likeHandler(blog);}}>like</button></p>
    <p>{`added by ${blog.user.name}`}</p>
  </>;
};

export default SingleBlogView;