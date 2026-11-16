import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import App from './App';
import { queryClient } from './api/queryClient';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css';

function AppRuntime() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="top-right" theme={theme} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRuntime />
    </ThemeProvider>
  </StrictMode>,
);
