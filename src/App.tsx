import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "./components/ThemeProvider";
import { AppShell } from "./components/os/AppShell";
import { BudgetPage } from "./pages/BudgetPage";
import { CrmPage } from "./pages/CrmPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FunnelPage } from "./pages/FunnelPage";
import { ManualPage } from "./pages/ManualPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TasksPage } from "./pages/TasksPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
