
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicWebsite from "./pages/PublicWebsite";
import Login from "./pages/Login";
import CRMDashboard from "./pages/CRMDashboard";
import Products from "./pages/Products";
import SalesOrders from "./pages/SalesOrders";
import Invoicing from "./pages/Invoicing";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crm" element={<AuthGuard><CRMDashboard /></AuthGuard>} />
          <Route path="/sales" element={<AuthGuard><SalesOrders /></AuthGuard>} />
          <Route path="/products" element={<AuthGuard><Products /></AuthGuard>} />
          <Route path="/invoicing" element={<AuthGuard><Invoicing /></AuthGuard>} />
          <Route path="/clients" element={<AuthGuard><Clients /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
