import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { HomeSideBar } from "./index";

vi.mock("./main-section", () => ({
  MainSection: () => <div data-testid="main-section">Main Section</div>,
}));

vi.mock("./personal-section", () => ({
  PersonalSection: () => (
    <div data-testid="personal-section">Personal Section</div>
  ),
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

    expect(screen.getByTestId("main-section")).toBeInTheDocument();
    expect(screen.getByTestId("personal-section")).toBeInTheDocument();
  });
});
