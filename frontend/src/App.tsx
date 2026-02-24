
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Courses from "./pages/Courses";
import Privacy from "./pages/Privacy";
import AdminFinanceDashboard from "./pages/AdminFinanceDashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminCourses from "./pages/AdminCourses";
import AdminFilters from "./pages/AdminFilters";
import AdminLinks from "./pages/AdminLinks";
import AdminReports from "./pages/AdminReports";
import AdminMetrics from "./pages/AdminMetrics";
import AdminAnalytics from "./pages/AdminAnalytics";

import SharedRedirect from "./pages/SharedRedirect";
import AdminWhatsappAnalytics from "./pages/AdminWhatsappAnalytics";
import AdminTopSellingPlans from "./pages/AdminTopSellingPlans";
import AdminPurchaseHistory from "./pages/AdminPurchaseHistory";
import AdminDiscountsAndCoupons from "./pages/AdminDiscountsAndCoupons";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import AdminCommunity from "./pages/AdminCommunity";
import Statistics from "./pages/Statistics";
import SystemSettings from '@/pages/SystemSettings';
import ProductsManagement from '@/pages/ProductsManagement';
import FinancialModule from '@/pages/FinancialModule';
import CommercialModule from '@/pages/CommercialModule';
import Analytics from "./pages/Analytics";
import CommunityHome from "./pages/community/CommunityHome";
import CommunityLogin from "./pages/community/CommunityLogin";
import CommunitySignup from "./pages/community/CommunitySignup";
import CommunityFeed from "./pages/community/CommunityFeed";
import PremiumServices from '@/pages/PremiumServices';
import PremiumServicesLogin from '@/pages/PremiumServicesLogin';
import LandingPage from '@/pages/LandingPage';
import PostJob from '@/pages/PostJob';
import PostMentorship from '@/pages/PostMentorship';
import PostCourse from '@/pages/PostCourse';
import BuildResume from '@/pages/BuildResume';
import SellJobPlans from '@/pages/SellJobPlans';
import SellMentorshipPlans from '@/pages/SellMentorshipPlans';
import SellCoursePlans from '@/pages/SellCoursePlans';
import SellResumeServices from '@/pages/SellResumeServices';
import AdminPeriodFilter from '@/pages/AdminPeriodFilter';
import CompanyRegistration from '@/pages/CompanyRegistration';
import MentorRegistration from '@/pages/MentorRegistration';
import InstitutionRegistration from '@/pages/InstitutionRegistration';
import CandidateRegistration from '@/pages/CandidateRegistration';
import CompanyDashboard from '@/pages/CompanyDashboard';
import CompanyManagement from '@/pages/CompanyManagement';
import CompanyPostJob from '@/pages/CompanyPostJob';
import InstitutionPostCourse from '@/pages/InstitutionPostCourse';
import PaymentCheckout from '@/pages/PaymentCheckout';
import JobDetailPage from '@/pages/JobDetailPage';
import AdminServiceRequests from '@/pages/AdminServiceRequests';
import CompanyPostJobV2 from '@/pages/CompanyPostJobV2';
import InstitutionDashboardV2 from '@/pages/InstitutionDashboardV2';
import InstitutionPostCourseV2 from '@/pages/InstitutionPostCourseV2';
import CourseDetailPage from '@/pages/CourseDetailPage';
import StatisticsPage from '@/pages/StatisticsPage';
import MentorDashboardV2 from '@/pages/MentorDashboardV2';
import MentorPostMentorshipV2 from '@/pages/MentorPostMentorshipV2';
import MentorshipDetailPage from '@/pages/MentorshipDetailPage';
import AdminClientsTab from '@/pages/AdminClientsTab';
import CandidatePostResume from '@/pages/CandidatePostResume';
import CandidateDashboard from '@/pages/CandidateDashboard';

function Router() {
  // DOCUMENTACAO DE ROTAS
  // =====================
  // ROTAS PUBLICAS (qualquer um pode acessar):
  // - / : Landing Page
  // - /home : Vagas e Cursos Publicos (listagem publica)
  // - /jobs, /courses : Filtros de vagas e cursos publicos
  //
  // ROTAS PRIVADAS - EMPRESAS (apenas empresas com plano ativo):
  // - /company-post-job : Cadastro de vagas por empresa
  // - /company-dashboard : Dashboard da empresa
  // - /company-registration : Cadastro de empresa (antes do checkout)
  //
  // ROTAS PRIVADAS - MENTORES (apenas mentores com plano ativo):
  // - /mentor-registration : Cadastro de mentor (antes do checkout)
  // - /mentor-dashboard : Dashboard do mentor (a implementar)
  //
  // ROTAS PRIVADAS - INSTITUICOES (apenas instituicoes com plano ativo):
  // - /institution-post-course : Cadastro de cursos por instituicao educacional (NOVO)
  // - /institution-registration : Cadastro de instituicao (antes do checkout)
  // - /institution-dashboard : Dashboard da instituicao (a implementar)
  //
  // ROTAS PRIVADAS - CANDIDATOS (apenas candidatos com plano ativo):
  // - /candidate-registration : Cadastro de candidato (antes do checkout)
  // - /candidate-dashboard : Dashboard do candidato (a implementar)
  //
  // ROTAS ADMIN (apenas administradores):
  // - /admin/* : Painel administrativo

  return (
    <Switch>
      <Route path={"/"} component={LandingPage} />
      <Route path={"/home"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/jobs"} component={AdminJobs} />
      <Route path={"/admin/courses"} component={AdminCourses} />
      <Route path={"/admin/filters"} component={AdminFilters} />
      <Route path={"/admin/links"} component={AdminLinks} />
      <Route path={"/admin/metrics"} component={AdminMetrics} />
      <Route path={"/admin/analytics"} component={AdminAnalytics} />

      <Route path="/admin/whatsapp-analytics" component={AdminWhatsappAnalytics} />
      <Route path="/admin/top-selling-plans" component={AdminTopSellingPlans} />
      <Route path="/admin/purchase-history" component={AdminPurchaseHistory} />
      <Route path="/admin/discounts-coupons" component={AdminDiscountsAndCoupons} />
      <Route path="/admin/period-filter" component={AdminPeriodFilter} />
      <Route path="/admin/executive-dashboard" component={ExecutiveDashboard} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path={"/admin/community"} component={AdminCommunity} />
      <Route path={"/admin/statistics"} component={Statistics} />
        <Route path="/admin/system-settings" component={SystemSettings} />
        <Route path="/admin/products" component={ProductsManagement} />
        <Route path="/admin/financial" component={FinancialModule} />
        <Route path="/admin/commercial" component={CommercialModule} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/community"} component={CommunityHome} />
      <Route path={"/community/login"} component={CommunityLogin} />
      <Route path={"/community/signup"} component={CommunitySignup} />
      <Route path={"/community/feed"} component={CommunityFeed} />
      <Route path={"/jobs"} component={Jobs} />
      <Route path={"/courses"} component={Courses} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/lgpd"} component={Privacy} />
      <Route path={"/terms"} component={Privacy} />
       <Route path={"/access"} component={Privacy} />
      <Route path="/premium-services-login" component={PremiumServicesLogin} />
      <Route path="/premium-services" component={PremiumServices} />
            <Route path={"/candidate-post-resume"} component={CandidatePostResume} />
      <Route path={"/candidate-dashboard"} component={CandidateDashboard} />
      <Route path={"/job/:sharedLink"} component={JobDetailPage} />
      <Route path={"/mentorship/:sharedLink"} component={MentorshipDetailPage} />
      <Route path={"/mentor-dashboard"} component={MentorDashboardV2} />
      <Route path={"/mentor-post-mentorship"} component={MentorPostMentorshipV2} />
      <Route path={"/admin/service-requests"} component={AdminServiceRequests} />
      <Route path={"/admin/clients"} component={AdminClientsTab} />
      <Route path={"/post-job"} component={PostJob} />
      <Route path={"/post-mentorship"} component={PostMentorship} />
      <Route path={"/post-course"} component={PostCourse} />
      <Route path={"/build-resume"} component={BuildResume} />
      <Route path={"/sell-job-plans"} component={SellJobPlans} />
      <Route path={"/sell-mentorship-plans"} component={SellMentorshipPlans} />
      <Route path={"/sell-course-plans"} component={SellCoursePlans} />
      <Route path={"/sell-resume-services"} component={SellResumeServices} />
      <Route path={"/company-registration"} component={CompanyRegistration} />
      <Route path={"/mentor-registration"} component={MentorRegistration} />
      <Route path={"/institution-registration"} component={InstitutionRegistration} />
      <Route path={"/candidate-registration"} component={CandidateRegistration} />
      <Route path={"/company-dashboard"} component={CompanyDashboard} />
      <Route path={"/company-post-job"} component={CompanyPostJobV2} />
      <Route path={"/institution-post-course"} component={InstitutionPostCourseV2} />
      <Route path={"/institution-dashboard"} component={InstitutionDashboardV2} />
      <Route path={"/course/:sharedLink"} component={CourseDetailPage} />
      <Route path={"/statistics"} component={StatisticsPage} />
      <Route path={"/institution-statistics"} component={StatisticsPage} />
      <Route path={"/admin/company-management"} component={CompanyManagement} />
      <Route path={"/payment-checkout"} component={PaymentCheckout} />
      <Route path={"/:shareToken"} component={SharedRedirect} />
      <Route path={"404"} component={NotFound} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
