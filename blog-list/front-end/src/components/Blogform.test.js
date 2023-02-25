import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blogform from "./Blogform";

test("blog form sends correct blog details", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<Blogform createBlog={createBlog} />);

  const inputs = screen.getAllByRole("textbox");
  await user.type(inputs[0], "testTitle");
  await user.type(inputs[1], "test Author");
  await user.type(inputs[2], "testUrl");

  const submitButton = screen.getByText("Submit");

  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testTitle");
  expect(createBlog.mock.calls[0][0].author).toBe("test Author");
  expect(createBlog.mock.calls[0][0].url).toBe("testUrl");

});