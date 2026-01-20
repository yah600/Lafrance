/**
 * Global Error Suppressor
 * Loads before React app to suppress Figma preview errors
 */

(function() {
  'use strict';
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Override console.error
  console.error = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Suppress Figma-specific errors
    if (
      message.includes('webpack-artifacts') ||
      message.includes('code_components_preview_iframe') ||
      message.includes('Unknown runtime error') ||
      message.includes('figma.com') ||
      message.includes('logPreviewError') ||
      message.includes('reduxState') ||
      message.includes('IndexedDB') ||
      message.includes('InvalidStateError') ||
      message.includes('DataError')
    ) {
      return; // Silently ignore
    }
    
    // Log all other errors
    originalError.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Suppress Figma-specific warnings
    if (
      message.includes('pending_') ||
      message.includes('IndexedDB') ||
      message.includes('unsynced')
    ) {
      return; // Silently ignore
    }
    
    // Log all other warnings
    originalWarn.apply(console, args);
  };
  
  // Global error event handler
  window.addEventListener('error', function(event) {
    const message = event.message || event.error?.toString() || '';
    const filename = event.filename || '';
    
    if (
      message.includes('Unknown runtime error') ||
      message.includes('webpack-artifacts') ||
      message.includes('code_components_preview_iframe') ||
      filename.includes('figma.com')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true); // Use capture phase
  
  // Unhandled rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    const message = event.reason?.toString() || '';
    
    if (
      message.includes('Unknown runtime error') ||
      message.includes('webpack-artifacts') ||
      message.includes('figma.com') ||
      message.includes('IndexedDB') ||
      message.includes('InvalidStateError')
    ) {
      event.preventDefault();
      return false;
    }
  });
  
})();
