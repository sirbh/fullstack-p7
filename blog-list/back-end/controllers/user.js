const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!password) {
    return response.status(400).json({ error: "password is required" });
  }

  if (password.length <= 3) {
    return response
      .status(400)
      .json({ error: "password should be atleast 4 char long" });
  }

  saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newuser = new User({
    username,
    name,
    passwordHash,
  });

  const user = await newuser.save();
  response.status(201).json(user);
});

module.exports = userRouter;
