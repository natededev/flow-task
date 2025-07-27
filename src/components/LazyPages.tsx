import { lazy } from 'react';

// Lazy load components to reduce initial bundle size
export const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
export const Tasks = lazy(() => import('@/pages/Tasks').then(m => ({ default: m.Tasks })));
export const Projects = lazy(() => import('@/pages/Projects').then(m => ({ default: m.Projects })));
export const Calendar = lazy(() => import('@/pages/Calendar').then(m => ({ default: m.Calendar })));
export const Team = lazy(() => import('@/pages/Team').then(m => ({ default: m.Team })));
export const Reports = lazy(() => import('@/pages/Reports').then(m => ({ default: m.Reports })));
export const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));
export const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
