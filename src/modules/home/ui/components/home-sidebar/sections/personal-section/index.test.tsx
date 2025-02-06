import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { PersonalSection } from ".";

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

describe("PersonalSection", () => {
  it("should render correctly", () => {
    render(<PersonalSection />, { wrapper: SidebarProvider });

    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("should render all menu items with correct links and icons", () => {
    render(<PersonalSection />, { wrapper: SidebarProvider });

    const historyLink = screen.getByRole("link", { name: /history/i });
    expect(historyLink).toHaveAttribute("href", "/playlist/history");
    expect(historyLink.querySelector("svg")).toBeInTheDocument();

    const likedVideosLink = screen.getByRole("link", { name: /liked videos/i });
    expect(likedVideosLink).toHaveAttribute("href", "/playlist/liked");
    expect(likedVideosLink.querySelector("svg")).toBeInTheDocument();

    const allPlaylistsLink = screen.getByRole("link", {
      name: /all playlists/i,
    });
    expect(allPlaylistsLink).toHaveAttribute("href", "/playlist");
    expect(allPlaylistsLink.querySelector("svg")).toBeInTheDocument();
  });
});
