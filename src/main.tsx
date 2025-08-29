import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext/AuthProvider.tsx";
import { ToastProvider } from "./context/ToastContext/toast.tsx";
import { NotificationProvider } from "./context/NotificationContext/NotificationContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { YOUR_GOOGLE_CLIENT_ID } from "./utils/google.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);
