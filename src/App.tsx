import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AcademySetup from "./pages/AcademySetup";
import StudentInput from "./pages/StudentInput";
import CSVImport from "./pages/CSVImport";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import ErrorFallback from "./components/error-fallback";
import { CanonicalManager } from "./components/canonical-manager";
import { AcademyProvider } from "./contexts/AcademyContext";

const queryClient = new QueryClient();

const App = () =>
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={(error, errorInfo) => {
    console.error(`Error Boundary caught an error(pathname:${location.pathname + location.search}):`, error, errorInfo);
    setTimeout(() => {
      throw error;
    }, 0);
  }}>

    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AcademyProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route element={<CanonicalManager />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/academy" element={<AcademySetup />} />
                  <Route path="/student-input" element={<StudentInput />} />
                  <Route path="/csv-import" element={<CSVImport />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AcademyProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>;


export default App;