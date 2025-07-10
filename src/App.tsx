
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicWebsite from "./pages/PublicWebsite";
import CRMDashboard from "./pages/CRMDashboard";
import Products from "./pages/Products";
import SalesLog from "./pages/SalesLog";
import Invoicing from "./pages/Invoicing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/crm" element={<CRMDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<SalesLog />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
