import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { MainSection } from "./main-section";

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

describe("MainSection", () => {
  it("should render all menu items correctly", () => {
    render(<MainSection />, { wrapper: SidebarProvider });

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink.querySelector("svg")).toBeInTheDocument();

    const subscriptionsLink = screen.getByRole("link", {
      name: /subscriptions/i,
    });
    expect(subscriptionsLink).toHaveAttribute("href", "/feed/subscriptions");
    expect(subscriptionsLink.querySelector("svg")).toBeInTheDocument();

    const trendingLink = screen.getByRole("link", { name: /trending/i });
    expect(trendingLink).toHaveAttribute("href", "/feed/trending");
    expect(trendingLink.querySelector("svg")).toBeInTheDocument();
  });

  it("should render items with correct structure", () => {
    render(<MainSection />, { wrapper: SidebarProvider });

    const menuItems = screen.getAllByRole("listitem");
    expect(menuItems).toHaveLength(3);
  });
});
