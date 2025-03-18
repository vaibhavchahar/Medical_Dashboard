import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import PatientsPage from "@/pages/dashboard/patients";
import DoctorsPage from "@/pages/dashboard/doctors";
import CalendarPage from "@/pages/dashboard/calendar";
import Settings from "@/pages/dashboard/settings";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/patients" component={PatientsPage} />
      <Route path="/dashboard/doctors" component={DoctorsPage} />
      <Route path="/dashboard/calendar" component={CalendarPage} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;