const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);

const testUser = {
  name: "test",
  username: "testUsername",
  password: "testPassword",
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await api.post("/api/users").send(testUser);
  const response = await api.get("/api/users");
  const fetchedUser = response.body[0];
  const blogObject = helper.blogWithTwoPost.map(
    (blog) =>
      new Blog({
        ...blog,
        user: fetchedUser.id,
      })
  );

  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("get blogs", () => {
  test("returns all blogs", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.length).toBe(2);
  });

  test("id is defined", async () => {
    const blogs = await api.get("/api/blogs");

    blogs.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("create blog", () => {
  test("add blog", async () => {
    const newblog = {
      author: "testAuthor",
      title: "testTitle",
      url: "testURL",
      likes: 0,
    };
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    await api
      .post("/api/blogs")
      .send(newblog)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.blogWithTwoPost.length + 1);
    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain("testTitle");
  });

  test("add blog without token should fail", async () => {
    const newblog = {
      author: "testAuthor",
      title: "testTitle",
      url: "testURL",
      likes: 0,
    };

    await api.post("/api/blogs").send(newblog).expect(401);
  });

  test("if like is missing add blog with default like=0", async () => {
    const newblog = {
      author: "testAuthor2",
      title: "testTitle2",
      url: "testURL2",
    };
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    const response = await api
      .post("/api/blogs")
      .send(newblog)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body.likes).toBe(0);
  });

  test("if title is missing, dont add", async () => {
    const newblog = {
      author: "testAuthor2",
      url: "testURL2",
      likes: 9,
    };
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    await api
      .post("/api/blogs")
      .send(newblog)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(400);
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.blogWithTwoPost.length);
  });

  test("if url is missing, dont add", async () => {
    const newblog = {
      author: "testAuthor2",
      likes: 9,
      title: "testTitle",
    };
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    await api
      .post("/api/blogs")
      .send(newblog)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(400);
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.blogWithTwoPost.length);
  });
});

describe("remove blog", () => {
  test("remove blog with given id", async () => {
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    await api
      .post("/api/blogs")
      .send(helper.blogWithOnePost[0])
      .set({ Authorization: `Bearer ${user.body.token}` });
    await api
      .delete(`/api/blogs/${helper.blogWithOnePost[0]._id}`)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(204);
  });
});

describe("update blog", () => {
  test("update likes of blog with given id", async () => {
    const user = await api.post("/api/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    await api
      .post("/api/blogs")
      .send(helper.blogWithOnePost[0])
      .set({ Authorization: `Bearer ${user.body.token}` });

    const updatedBlog = {
      author: helper.blogWithOnePost[0].author,
      title: helper.blogWithOnePost[0].title,
      url: helper.blogWithOnePost[0].url,
      likes: 14,
    };


    const response = await api
      .put(`/api/blogs/${helper["blogWithOnePost"][0]._id}`)
      .send(updatedBlog)
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(200);

    expect(response.body.likes).toBe(14);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
