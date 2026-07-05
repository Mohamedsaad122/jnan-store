import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test (important for isolated state)
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Clean up after the tests are finished
afterAll(() => server.close());

// Global Mock for react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: async () => {},
      language: 'ar',
      dir: () => 'rtl',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;
