import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "./components/ThemeProvider";
import { AppShell } from "./components/os/AppShell";
import { RouteSkeleton } from "./components/os/RouteSkeleton";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const CrmPage = lazy(() => import("./pages/CrmPage").then((module) => ({ default: module.CrmPage })));
const BudgetPage = lazy(() => import("./pages/BudgetPage").then((module) => ({ default: module.BudgetPage })));
const FunnelPage = lazy(() => import("./pages/FunnelPage").then((module) => ({ default: module.FunnelPage })));
const ManualPage = lazy(() => import("./pages/ManualPage").then((module) => ({ default: module.ManualPage })));
const TasksPage = lazy(() => import("./pages/TasksPage").then((module) => ({ default: module.TasksPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/crm" element={<CrmPage />} />
                <Route path="/orcamentos" element={<BudgetPage />} />
                <Route path="/funil" element={<FunnelPage />} />
                <Route path="/manual" element={<ManualPage />} />
                <Route path="/tarefas" element={<TasksPage />} />
                <Route path="/configuracoes" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
