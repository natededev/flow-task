// Critical path optimization utilities
export const deferNonCriticalCSS = () => {
  // Load non-critical CSS asynchronously
  const loadCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  };

  // Example: Load icon fonts or theme CSS after critical path
  // loadCSS('/css/icons.css');
  // loadCSS('/css/themes.css');
};

export const preloadCriticalResources = () => {
  // Only preload resources that actually exist in the build
  // The actual chunk names are generated with hashes, so we skip static preloading
  // Instead, let Vite's module preloading handle this automatically
  
  // We can add dynamic preloading after the build is complete
  // This avoids 404 errors from hardcoded chunk names
};

export const optimizeInitialRender = () => {
  // Remove loading screen after critical resources are ready
  requestIdleCallback(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.remove();
    }
  });
};

// Task scheduler to break up long tasks
export const taskScheduler = {
  // Break up synchronous work into smaller chunks
  yieldToMain: () => {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  },

  // Schedule work with MessageChannel for better performance
  scheduleWork: (callback: () => void) => {
    const channel = new MessageChannel();
    channel.port2.onmessage = () => callback();
    channel.port1.postMessage(null);
  },

  // Break large arrays into chunks to prevent long tasks
  processArrayInChunks: async <T>(
    array: T[],
    processor: (item: T, index: number) => void,
    chunkSize: number = 50
  ) => {
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      chunk.forEach((item, index) => processor(item, i + index));
      
      // Yield to main thread after each chunk
      if (i + chunkSize < array.length) {
        await taskScheduler.yieldToMain();
      }
    }
  },

  // Debounced task execution
  debounceTask: <T extends unknown[]>(fn: (...args: T) => void, delay: number = 16) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
};

// First Contentful Paint optimization
export const fcpOptimizer = {
  // Inline critical CSS
  inlineCriticalCSS: () => {
    const criticalCSS = `
      /* Critical above-the-fold styles */
      .header { height: 64px; }
      .main-content { min-height: calc(100vh - 64px); }
      .loading-placeholder { 
        width: 100%; 
        height: 200px; 
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  },

  // Optimize font loading
  optimizeFonts: () => {
    // Use system fonts instead of loading custom fonts that may not exist
    const fontCSS = `
      body, input, select, textarea {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-display: swap;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = fontCSS;
    document.head.appendChild(style);
  }
};

// Largest Contentful Paint optimization
export const lcpOptimizer = {
  // Preload hero images or critical content
  preloadLCPImage: (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  },

  // Optimize LCP element rendering
  optimizeLCPElement: () => {
    // Ensure LCP element is prioritized
    const lcpElements = document.querySelectorAll('[data-lcp]');
    lcpElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.contentVisibility = 'visible';
        element.style.containIntrinsicSize = 'auto';
      }
    });
  }
};

// Cumulative Layout Shift optimization
export const clsOptimizer = {
  // Reserve space for dynamic content
  reserveSpace: (selector: string, height: number) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.minHeight = `${height}px`;
      }
    });
  },

  // Set size attributes for images
  setSizeAttributes: () => {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        // Set default dimensions to prevent layout shift
        img.width = img.naturalWidth || 300;
        img.height = img.naturalHeight || 200;
      }
    });
  }
};
