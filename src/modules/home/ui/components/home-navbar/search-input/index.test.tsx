import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchInput } from ".";

describe("SearchInput", () => {
  it("should render search input and button", () => {
    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "test search");
    expect(input).toHaveValue("test search");
  });

  it("should handle form submission", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const form = screen.getByRole("form");
    const submitEvent = vi.fn((e) => e.preventDefault());
    form.addEventListener("submit", submitEvent);

    await user.type(screen.getByPlaceholderText("Search"), "test");
    await user.click(screen.getByRole("button"));

    expect(submitEvent).toHaveBeenCalled();
  });
});
