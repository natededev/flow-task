import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useClientStore } from '@/store/clientStore';

/**
 * Test component to verify our new React Query + Zustand architecture
 * This demonstrates the separation of concerns:
 * - React Query for server state (auth, tasks, projects)
 * - Zustand for client state (UI, theme, current selections)
 */
export function TestArchitecture() {
  const { theme, sidebarOpen, setSidebarOpen, setTheme } = useClientStore();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const { tasks, filteredTasks, addTask, isCreating } = useTasks();
  const { projects, addProject, currentProject, setCurrentProject } = useProjects();

  const handleTestLogin = async () => {
    try {
      await login('admin@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAddTestTask = async () => {
    try {
      await addTask({
        title: 'Test Task',
        description: 'A test task created via React Query',
        status: 'todo',
        priority: 'medium',
        assigneeId: user?.id || '1',
        projectId: currentProject?.id || projects[0]?.id || '1',
        createdBy: user?.id || '1',
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleAddTestProject = async () => {
    try {
      await addProject({
        title: 'Test Project',
        description: 'A test project created via React Query',
        priority: 'medium',
        status: 'active',
        members: [user?.id || '1'],
        createdBy: user?.id || '1',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Architecture Test</h1>
      
      {/* Client State (Zustand) */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Client State (Zustand)</h2>
        <div className="space-y-2">
          <div>Theme: {theme}</div>
          <div>Sidebar Open: {sidebarOpen ? 'Yes' : 'No'}</div>
          <div>Current Project: {currentProject?.title || 'None'}</div>
          <div className="space-x-2">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Toggle Theme
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Toggle Sidebar
            </button>
          </div>
        </div>
      </div>

      {/* Server State: Auth (React Query) */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Auth State (React Query)</h2>
        <div className="space-y-2">
          <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
          <div>User: {user?.name || 'None'}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div className="space-x-2">
            {!isAuthenticated ? (
              <button 
                onClick={handleTestLogin}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Test Login
              </button>
            ) : (
              <button 
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Server State: Projects (React Query) */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Projects State (React Query)</h2>
        <div className="space-y-2">
          <div>Projects Count: {projects.length}</div>
          <div>Current Project: {currentProject?.title || 'None'}</div>
          <div className="space-x-2">
            <button 
              onClick={handleAddTestProject}
              className="px-3 py-1 bg-purple-500 text-white rounded"
            >
              Add Test Project
            </button>
            {projects.length > 0 && (
              <button 
                onClick={() => setCurrentProject(projects[0])}
                className="px-3 py-1 bg-indigo-500 text-white rounded"
              >
                Select First Project
              </button>
            )}
          </div>
          <div>
            <h3 className="font-medium">Projects:</h3>
            <ul className="list-disc list-inside">
              {projects.map(project => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Server State: Tasks (React Query) */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Tasks State (React Query)</h2>
        <div className="space-y-2">
          <div>Total Tasks: {tasks.length}</div>
          <div>Filtered Tasks: {filteredTasks.length}</div>
          <div>Creating: {isCreating ? 'Yes' : 'No'}</div>
          <div>
            <button 
              onClick={handleAddTestTask}
              disabled={isCreating}
              className="px-3 py-1 bg-orange-500 text-white rounded disabled:opacity-50"
            >
              Add Test Task
            </button>
          </div>
          <div>
            <h3 className="font-medium">Tasks:</h3>
            <ul className="list-disc list-inside">
              {filteredTasks.slice(0, 5).map(task => (
                <li key={task.id}>{task.title} - {task.status}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
