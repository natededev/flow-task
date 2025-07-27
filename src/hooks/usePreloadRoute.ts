import { useEffect } from 'react';

// Preload lazy components on route hover or focus
export const usePreloadRoute = (routeKey: string) => {
  useEffect(() => {
    const preloadRoute = () => {
      switch (routeKey) {
        case 'dashboard':
          import('@/pages/Dashboard');
          break;
        case 'tasks':
          import('@/pages/Tasks');
          break;
        case 'projects':
          import('@/pages/Projects');
          break;
        case 'calendar':
          import('@/pages/Calendar');
          break;
        case 'team':
          import('@/pages/Team');
          break;
        case 'reports':
          import('@/pages/Reports');
          break;
        case 'settings':
          import('@/pages/Settings');
          break;
        case 'profile':
          import('@/pages/Profile');
          break;
      }
    };

    // Small delay to avoid immediate preloading
    const timeoutId = setTimeout(preloadRoute, 50);
    return () => clearTimeout(timeoutId);
  }, [routeKey]);
};

// Preload function for navigation items
export const preloadRouteOnHover = (routeKey: string) => {
  switch (routeKey) {
    case 'dashboard':
      import('@/pages/Dashboard');
      break;
    case 'tasks':
      import('@/pages/Tasks');
      break;
    case 'projects':
      import('@/pages/Projects');
      break;
    case 'calendar':
      import('@/pages/Calendar');
      break;
    case 'team':
      import('@/pages/Team');
      break;
    case 'reports':
      import('@/pages/Reports');
      break;
    case 'settings':
      import('@/pages/Settings');
      break;
    case 'profile':
      import('@/pages/Profile');
      break;
  }
};
