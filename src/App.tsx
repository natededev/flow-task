import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Auth } from "@/pages/Auth";
import * as LazyPages from "@/components/LazyPages";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <LazyPages.Dashboard />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Tasks />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Projects />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Projects />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Calendar />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/team" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Team />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Reports />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Settings />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <LazyPages.Profile />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </ErrorBoundary>
);

export default App;
