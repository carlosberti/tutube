import { render, screen } from "@testing-library/react";

import { HomeLayout } from "./home-layout";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

vi.mock("../components/home-navbar", () => ({
  HomeNavBar: () => <nav data-testid="home-navbar">Home NavBar</nav>,
}));

vi.mock("../components/home-sidebar", () => ({
  HomeSideBar: () => <aside data-testid="home-sidebar">Home SideBar</aside>,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
}));

describe("HomeLayout", () => {
  it("should render all components correctly", () => {
    render(
      <HomeLayout>
        <div>Test Content</div>
      </HomeLayout>
    );

    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
    expect(screen.getByTestId("home-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("home-sidebar")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
