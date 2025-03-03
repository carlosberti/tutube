import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { HomeSideBar } from "./index";

vi.mock("./sections", () => ({
  Sections: () => <div data-testid="sections">Sections</div>,
}));

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

describe("HomeSideBar", () => {
  it("should render correctly", () => {
    render(<HomeSideBar />, { wrapper: SidebarProvider });

    expect(screen.getByTestId("sections")).toBeInTheDocument();
  });
});
