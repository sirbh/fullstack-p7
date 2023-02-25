const bcrypt = require("bcryptjs");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const api = supertest(app);

describe("user tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash, name: "rootuser" });

    await user.save();
  });
  test("if user can be created", async () => {
    const testUser = {
      name: "testuser",
      username: "testUsername",
      password: "testpassword",
    };
    const users = await User.find({});

    const response = await api
      .post("/api/users")
      .send(testUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfterSave = await User.find({});

    const names = usersAfterSave.map((users) => users.name);
    expect(usersAfterSave.length).toBe(users.length + 1);
    expect(names).toContain(testUser.name);
  });

  test("dont save without username", async () => {
    const testUser = {
      name: "testuser",
      password: "testpassword",
    };
    const users = await User.find({});

    const response = await api.post("/api/users").send(testUser).expect(400);

    const usersAfterSave = await User.find({});
    expect(usersAfterSave.length).toBe(users.length);
  });

  test("dont save without password", async () => {
    const testUser = {
      name: "testuser",
      username: "testUsername",
    };
    const users = await User.find({});

    const response = await api.post("/api/users").send(testUser).expect(400);

    const usersAfterSave = await User.find({});
    expect(usersAfterSave.length).toBe(users.length);
  });

  test("username should be atleast 4 char long", async () => {
    const testUser = {
      name: "use",
      password: "password",
    };
    const users = await User.find({});

    const response = await api.post("/api/users").send(testUser).expect(400);

    const usersAfterSave = await User.find({});
    expect(usersAfterSave.length).toBe(users.length);
  });

  test("password should be atleast 4 char long", async () => {
    const testUser = {
      name: "username",
      password: "pas",
    };
    const users = await User.find({});

    const response = await api.post("/api/users").send(testUser).expect(400);

    const usersAfterSave = await User.find({});
    expect(usersAfterSave.length).toBe(users.length);
  });

  test("username should be unique", async () => {
    const testUser = {
      name: "name",
      password: "pas",
      username: "root",
    };
    const users = await User.find({});

    const response = await api.post("/api/users").send(testUser).expect(400);

    const usersAfterSave = await User.find({});
    expect(usersAfterSave.length).toBe(users.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
