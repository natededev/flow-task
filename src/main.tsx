import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './index.css'
import { fcpOptimizer, preloadCriticalResources, optimizeInitialRender, taskScheduler } from './utils/performance'

// Performance optimizations for critical path
fcpOptimizer.inlineCriticalCSS();
fcpOptimizer.optimizeFonts();
preloadCriticalResources();

// Break up initialization into smaller tasks
const initializeApp = async () => {
  // Yield to main thread before heavy operations
  await taskScheduler.yieldToMain();

  // Create React Query client with optimized settings
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Reduce network overhead
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  // Yield to main thread before creating root
  await taskScheduler.yieldToMain();

  const root = createRoot(document.getElementById("root")!);

  // Yield to main thread before rendering
  await taskScheduler.yieldToMain();

  // Render app with scheduler optimization
  taskScheduler.scheduleWork(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <App />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
    
    // Cleanup loading state
    optimizeInitialRender();
  });
};

// Use scheduler to prioritize critical rendering
if ('scheduler' in window) {
  // @ts-expect-error - scheduler API is experimental
  window.scheduler.postTask(initializeApp, { priority: 'user-blocking' });
} else {
  // Fallback for browsers without scheduler API
  requestIdleCallback(() => initializeApp(), { timeout: 100 });
}
