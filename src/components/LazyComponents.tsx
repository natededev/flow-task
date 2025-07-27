import { lazy, Suspense } from 'react';
import { memo } from 'react';

// Optimized loading fallback
const ComponentLoader = memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
  </div>
));

// Micro-lazy loading for heavy components
export const LazyTaskCard = lazy(() => 
  import('@/components/Task/TaskCard').then(module => ({ 
    default: memo(module.TaskCard) 
  }))
);

export const LazyProjectCard = lazy(() => 
  import('@/components/Project/ProjectCard').then(module => ({ 
    default: memo(module.ProjectCard) 
  }))
);

export const LazyTaskForm = lazy(() => 
  import('@/components/Task/TaskForm').then(module => ({ 
    default: memo(module.TaskForm) 
  }))
);

export const LazyProjectForm = lazy(() => 
  import('@/components/Project/ProjectForm').then(module => ({ 
    default: memo(module.ProjectForm) 
  }))
);

// Wrapper component for lazy loading with optimized suspense
export const LazyWrapper = memo(({ 
  children, 
  fallback = <ComponentLoader /> 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
));
