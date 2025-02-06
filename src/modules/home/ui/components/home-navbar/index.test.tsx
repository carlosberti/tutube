import { render, screen } from "@testing-library/react";

import { HomeNavBar } from "./index";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => (
    <button data-testid="sidebar-trigger">Toggle Sidebar</button>
  ),
}));

vi.mock("@/modules/auth/ui/components/auth-button", () => ({
  AuthButton: () => <button data-testid="auth-button">Auth</button>,
}));

vi.mock("./search-input", () => ({
  SearchInput: () => <div data-testid="search-input">Search Input</div>,
}));

describe("HomeNavBar", () => {
  it("should render all components correctly", () => {
    render(<HomeNavBar />);

    const logo = screen.getByAltText("TuTube logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.svg");

    expect(screen.getByText("TuTube")).toBeInTheDocument();

    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("auth-button")).toBeInTheDocument();
  });

  it("should have correct layout structure", () => {
    render(<HomeNavBar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link");
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
