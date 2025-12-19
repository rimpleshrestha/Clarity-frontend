import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Toaster } from "./components/ui/sonner.tsx";
import { JournalUnlockProvider } from "./contexts/LockContext.tsx";
import { UnlockModal } from "./components/UnlockModel.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }: FallbackProps) => {
        return (
          <p>
            {error.message}
            <button onClick={resetErrorBoundary}></button>
          </p>
        );
      }}
    >
      <JournalUnlockProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
        <UnlockModal />
      </JournalUnlockProvider>
    </ErrorBoundary>
  </StrictMode>
);
