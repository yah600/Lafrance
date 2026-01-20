
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Add error handling for debugging
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    console.log("Initializing React app...");
    createRoot(rootElement).render(<App />);
    console.log("React app initialized successfully");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // Show error in DOM if React fails to mount
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h1 style="color: #e53e3e;">Application Error</h1>
          <p>Failed to initialize the application. Check the browser console for details.</p>
          <pre style="background: #f7fafc; padding: 10px; border-radius: 4px; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      `;
    }
  }
