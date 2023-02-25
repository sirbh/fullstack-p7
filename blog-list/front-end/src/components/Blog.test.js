import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders title and author", () => {
  const blog = {
    author: "testAuthor",
    title: "testTitle",
    id: "testID",
    url: "testUrl",
    user: {
      username: "testusername",
      name: "testname",
      id: "testId",
    },
    likes: 3,
  };
  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".blog");

  expect(div).toHaveTextContent("testAuthor");

  expect(div).toHaveTextContent("testTitle");

  expect(div).not.toHaveTextContent(3);

  expect(div).not.toHaveTextContent("testUrl");
});

test("clicking the button show likes and url", async () => {
  const blog = {
    author: "testAuthor",
    title: "testTitle",
    id: "testID",
    url: "testUrl",
    user: {
      username: "testusername",
      name: "testname",
      id: "testId",
    },
    likes: 3,
  };

  const testuser = {
    username: "testusername",
    name: "testname",
    id: "testId",
  };

  // const mockHandler = jest.fn();

  const { container } = render(<Blog blog={blog} user={testuser} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const div = container.querySelector(".blog");

  expect(div).toHaveTextContent("testAuthor");

  expect(div).toHaveTextContent("testTitle");

  expect(div).toHaveTextContent(3);

  expect(div).toHaveTextContent("testUrl");

});

test("clicking the like button should run likehandler function", async () => {
  const blog = {
    author: "testAuthor",
    title: "testTitle",
    id: "testID",
    url: "testUrl",
    user: {
      username: "testusername",
      name: "testname",
      id: "testId",
    },
    likes: 3,
  };

  const testuser = {
    username: "testusername",
    name: "testname",
    id: "testId",
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} user={testuser} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("Like");

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);

});
