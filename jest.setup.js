import "@testing-library/jest-dom";

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/app/lib/actions", () => ({
  handleHide: jest.fn(),
  getVisitedNews: jest.fn(() => Promise.resolve([])),
  onCheck: jest.fn(),
}));

jest.mock("@iconify/react", () => ({
  Icon: () => null,
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
