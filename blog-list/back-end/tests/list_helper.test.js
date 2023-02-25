const listHelper = require("../utils/list_helper");
const {
  blogWithMultiplePost,
  blogWithNoPost,
  blogWithOnePost,
} = require("./test_helper");

describe("total likes", () => {
  test("blog with one post", () => {
    const result = listHelper.totalLikes(blogWithOnePost);
    expect(result).toBe(10);
  });

  test("blog with 0 post", () => {
    const result = listHelper.totalLikes(blogWithNoPost);
    expect(result).toBe(0);
  });

  test("blog with multiple post", () => {
    const result = listHelper.totalLikes(blogWithMultiplePost);
    expect(result).toBe(36);
  });
});

describe("favblog", () => {
  test("blog with one post", () => {
    const result = listHelper.favoriteBlog(blogWithOnePost);
    expect(result).toEqual({
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    });
  });

  test("blog with 0 post", () => {
    const result = listHelper.favoriteBlog(blogWithNoPost);
    expect(result).toEqual(null);
  });

  test("blog with multiple post", () => {
    const result = listHelper.favoriteBlog(blogWithMultiplePost);
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("mostblogs", () => {
  test("blog with one post", () => {
    const result = listHelper.mostBlogs(blogWithOnePost);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 1,
    });
  });

  test("blog with 0 post", () => {
    const result = listHelper.mostBlogs(blogWithNoPost);
    expect(result).toEqual(null);
  });

  test("blog with multiple post", () => {
    const result = listHelper.mostBlogs(blogWithMultiplePost);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("mostLikes", () => {
  test("blog with one post", () => {
    const result = listHelper.mostLikes(blogWithOnePost);
    expect(result).toEqual({
      author: "Robert C. Martin",
      likes: 10,
    });
  });

  test("blog with 0 post", () => {
    const result = listHelper.mostLikes(blogWithNoPost);
    expect(result).toEqual(null);
  });

  test("blog with multiple post", () => {
    const result = listHelper.mostLikes(blogWithMultiplePost);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
