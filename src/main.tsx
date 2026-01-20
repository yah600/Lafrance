
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Global error handler - catch ALL errors
  window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error caught:", { message, source, lineno, colno, error });
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 50px auto; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
          <h1 style="color: #856404;">⚠️ JavaScript Error Detected</h1>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>File:</strong> ${source}</p>
          <p><strong>Line:</strong> ${lineno}:${colno}</p>
          ${error ? `<pre style="background: #f7fafc; padding: 10px; border-radius: 4px; overflow: auto; white-space: pre-wrap;">${error.stack || error}</pre>` : ''}
          <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Reload Page</button>
        </div>
      `;
    }
    return true;
  };

  window.onunhandledrejection = function(event) {
    console.error("Unhandled promise rejection:", event.reason);
    const rootElement = document.getElementById("root");
    if (rootElement && !rootElement.innerHTML.includes("JavaScript Error")) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 50px auto; background: #f8d7da; border: 2px solid #f5c6cb; border-radius: 8px;">
          <h1 style="color: #721c24;">⚠️ Promise Rejection Error</h1>
          <p><strong>Reason:</strong> ${event.reason}</p>
          <pre style="background: #f7fafc; padding: 10px; border-radius: 4px; overflow: auto; white-space: pre-wrap;">${event.reason?.stack || event.reason}</pre>
          <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Reload Page</button>
        </div>
      `;
    }
  };

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
        <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 50px auto; background: #f8d7da; border: 2px solid #dc3545; border-radius: 8px;">
          <h1 style="color: #721c24;">🚨 Application Initialization Error</h1>
          <p>Failed to initialize the React application.</p>
          <p><strong>Error:</strong></p>
          <pre style="background: #f7fafc; padding: 10px; border-radius: 4px; overflow: auto; white-space: pre-wrap;">${error instanceof Error ? error.stack || error.message : String(error)}</pre>
          <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Reload Page</button>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Check the browser console (F12) for more details.</p>
        </div>
      `;
    }
  }
