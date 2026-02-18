import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Courses from "./pages/Courses";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminCourses from "./pages/AdminCourses";
import AdminFilters from "./pages/AdminFilters";
import AdminLinks from "./pages/AdminLinks";
import AdminReports from "./pages/AdminReports";
import AdminMetrics from "./pages/AdminMetrics";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import SharedRedirect from "./pages/SharedRedirect";
import AdminWhatsappAnalytics from "./pages/AdminWhatsappAnalytics";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/jobs"} component={AdminJobs} />
      <Route path={"/admin/courses"} component={AdminCourses} />
      <Route path={"/admin/filters"} component={AdminFilters} />
      <Route path={"/admin/links"} component={AdminLinks} />
      <Route path={"/admin/metrics"} component={AdminMetrics} />
      <Route path={"/admin/analytics"} component={AdminAnalytics} />
      <Route path={"/admin/advanced-analytics"} component={AdvancedAnalytics} />
      <Route path={"/admin/whatsapp-analytics"} component={AdminWhatsappAnalytics} />
      <Route path={"/admin/reports"} component={AdminReports} />
      <Route path={"/jobs"} component={Jobs} />
      <Route path={"/courses"} component={Courses} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/lgpd"} component={Privacy} />
      <Route path={"/terms"} component={Privacy} />
      <Route path={"/access"} component={Privacy} />
      <Route path={"/shared/:shareToken"} component={SharedRedirect} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Claunnetworking Theme: Light background with purple primary and green secondary
// Design: Modern, professional, with rounded corners and smooth transitions

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
