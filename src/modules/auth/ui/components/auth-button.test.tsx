import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

import { AuthButton } from "./auth-button";

describe("AuthButton", () => {
  it("should render sign in button with icon", () => {
    render(<AuthButton />);
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector(".lucide-circle-user")).toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<AuthButton />);

    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).not.toHaveFocus();

    await user.tab();
    expect(button).toHaveFocus();
  });
});
