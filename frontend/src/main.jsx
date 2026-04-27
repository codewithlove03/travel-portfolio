// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

// React Query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#f5f0e8",
              border: "1px solid rgba(212, 168, 83, 0.3)",
              fontFamily: '"DM Sans", sans-serif',
            },
            success: {
              iconTheme: { primary: "#d4a853", secondary: "#0a0a0f" },
            },
            error: { iconTheme: { primary: "#e05a5a", secondary: "#0a0a0f" } },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
