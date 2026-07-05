/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

interface WrapperProps {
  children: React.ReactNode;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

export function render(
  ui: ReactElement,
  {
    route = '/',
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: { route?: string; queryClient?: QueryClient } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: WrapperProps) {
    return (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// Re-export everything for convenience
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { createTestQueryClient };
