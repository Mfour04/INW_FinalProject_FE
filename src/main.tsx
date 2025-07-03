import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx'
import { ToastProvider } from './context/ToastContext/toast.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
)
